import TelegramBot from "node-telegram-bot-api";
import {replyCompleteButton, replyOptionsButton, replySubscribeButton} from "./buttons.bot";
import { dailyMessage, EnterMessages, profileMessage, updatedMysteria } from "../keys/messages/messages.messages";
import { AnswerStates, SubscribeStates } from "../keys/enums/subscribe.enum";
import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import { Mysteria } from "../models/mysteria.model";
import { MysteriaController } from "../controllers/bot/mysteria.controller";
import { MysteriaService } from "../services/mysteria.service";
import { Database } from "../sql/db";
import { UtilitesBot } from "../utilities/bot";
import { UserController } from "../controllers/bot/user.controller";
import { UserService } from "../services/user.service";
import express from "express";
import bodyParser from "body-parser";

export class Bot {
    private static instance: Bot;
    private bot: TelegramBot;
    private subscribinState: SubscribeStates;
    private user:User= new User('', '', null, {} as Mysteria);
    private mysteriaController:MysteriaController;
    private userController:UserController;
    private userSession:Map<number, User> = new Map<number, User>();

    constructor(private token: string) {
        this.mysteriaController = new MysteriaController(new MysteriaService(new Database));
        this.userController = new UserController(new UserService(new Database));
        this.bot = new TelegramBot(token, {
            polling: {
              interval: 300,  
              autoStart: true,
              params: {
                timeout: 10, 
              },
            },
          });
        this.subscribinState = SubscribeStates.SUBSCRIBE;
        this.initialize();
    }
    public static getInstance(token: string): Bot { 
        if (!Bot.instance) { 
            Bot.instance = new Bot(token); 
        } 
        return Bot.instance; 
    }
    private initialize(): void {
        this.bot.onText(/\/start/, (msg:TelegramBot.Message) => this.handleStartCommand(msg));
        this.bot.on('message', (msg: TelegramBot.Message)=> this.handleSubscribing(msg))
        this.bot.on('message', (msg: TelegramBot.Message)=> this.handleDelete(msg))
    }

    private handleStartCommand(msg: TelegramBot.Message): void {
        const chatId = msg.chat.id;
        this.subscribinState = SubscribeStates.SUBSCRIBE;
        if(this.subscribinState === SubscribeStates.SUBSCRIBE){
            this.bot.sendMessage(chatId, EnterMessages.enter_message, replySubscribeButton);
        }
        else{
            this.bot.sendMessage(chatId, '');
        }
    }

    private handleSubscribing(msg: TelegramBot.Message): void {
        const chatId = msg.chat.id;
        const text = msg.text!;
        this.userSession.set(chatId, this.user)
    
        if(this.subscribinState !== SubscribeStates.UNSUBSCRIBE) {
            if (text === SubscribeStates.SUBSCRIBE) {
                this.bot.sendMessage(chatId, SubscribeStates.ASK_NAME);
                this.subscribinState = SubscribeStates.ASK_NAME;
            } 
            else if (this.subscribinState === SubscribeStates.ASK_NAME) {
                this.userSession.get(chatId)!.name = text;
                this.bot.sendMessage(chatId, `${AnswerStates.RECORD_NAME}: ${text} \n${SubscribeStates.ASK_EMAIL}`);
                this.subscribinState = SubscribeStates.ASK_EMAIL;
            }
            else if(this.subscribinState === SubscribeStates.ASK_EMAIL) {
                this.userSession.get(chatId)!.email = text;
                this.mysteriaController.getAllMysteries()
                .then(mysteriesKeyboard => {
                    this.bot.sendMessage(chatId, `${AnswerStates.RECORD_EMAIL}: ${text} \n${SubscribeStates.ASK_MYSTERIA}`, mysteriesKeyboard);
                })
                .catch(error=>console.log(error))
                .finally(() => this.subscribinState = SubscribeStates.ASK_MYSTERIA);
            }
            else if(this.subscribinState === SubscribeStates.ASK_MYSTERIA) {
                this.userSession.get(chatId)!.mysteria = new Mysteria(text, UtilitesBot.getId(text));
                this.userSession.get(chatId)!.mysteria.text = text; 
                this.bot.sendMessage(chatId, profileMessage(this.userSession.get(chatId)!.name, this.userSession.get(chatId)!.email, this.userSession.get(chatId)!.mysteria.text), replyCompleteButton);
                this.subscribinState = SubscribeStates.ASK_COMPLETE;
            }
    
            if(text === AnswerStates.COMPLETE){
                this.userController.getUser(chatId).then(existedUser=>{
                    if(existedUser){
                        this.userController.updateUser(this.userSession.get(chatId)!)
                        .then(()=>{
                            this.bot.sendMessage(chatId, SubscribeStates.UPDATE, replyOptionsButton);
                            this.user = new User('','', null, {} as Mysteria);
                            this.userSession.delete(chatId);
                        })
                        .catch(error=>console.log(error))
                    }
                    else{
                        this.userController.addNewUser(this.userSession.get(chatId)!)
                            .catch(error=>console.log(error))
                            .finally(()=>{
                                this.bot.sendMessage(chatId, AnswerStates.END, replyOptionsButton); 
                                this.user = new User('','', null, {} as Mysteria);
                                this.userSession.delete(chatId);
                            })
                    }
                })
            }
        }
    
        if(text === SubscribeStates.AGAIN){
            this.user = new User('', '', null, {} as Mysteria);
            this.userSession.delete(chatId);
            this.userSession.set(chatId, this.user);
            this.subscribinState = SubscribeStates.SUBSCRIBE;
            this.bot.sendMessage(chatId, SubscribeStates.ASK_NAME);
            this.subscribinState = SubscribeStates.ASK_NAME;
        }
    }

    private handleDelete(msg: TelegramBot.Message):void{
        const chatId = msg.chat.id;
        const text = msg.text!;
        console.log(this.subscribinState)
        console.log(this.userSession.get(chatId))
        if(text === SubscribeStates.UNSUBSCRIBE){
            this.userController.deleteUser(this.user).then(()=>{
                this.bot.sendMessage(chatId, AnswerStates.END_UNSUBSCRIBING)
                this.user = new User('', '', null, {} as Mysteria);
                this.userSession.delete(chatId);
                this.subscribinState = SubscribeStates.SUBSCRIBE;
                if(this.subscribinState === SubscribeStates.SUBSCRIBE){
                    this.bot.sendMessage(chatId, EnterMessages.enter_message, replySubscribeButton);
                }
                else{
                    this.bot.sendMessage(chatId, '');
                }
        });
        }
    }

    private handleUpdateMysteries(chatId:number):void{
        if(new Date().getDate() === 1){
            this.mysteriaController.updateMysteries().then(()=>{
                this.userController.getUser(chatId).then(user=>{
                    this.mysteriaController.getMysteriaById(user?.mysteries_id!).then(mysteria=>{
                        this.bot.sendMessage(chatId, updatedMysteria(mysteria));
                    }).catch(error=>console.log(error))
                }).catch(error=>console.log(error))
            }).catch(error=>console.log(error))
        }
    }

    private Mailing():void{
        this.userController.getAllUsers().then((users) => {
            for (let user of users) {
                if (user.tg_id) {
                    this.bot.sendMessage(user.tg_id!, dailyMessage());
                    this.handleUpdateMysteries(user.tg_id!);
                }
            }
        }).catch(error=>console.log(error));;
    }
    
    private scheduleDailyMailing(): void {
        const now = new Date();
        const next3PM = new Date();
    
        next3PM.setHours(15, 0, 0, 0); 
    
        if (now > next3PM) {
            next3PM.setDate(next3PM.getDate() + 1);
        }
    
        const delay = next3PM.getTime() - now.getTime();
    
        setTimeout(() => {
            this.Mailing(); 
            this.scheduleDailyMailing(); 
        }, delay);
    }
    
    public Start(): void {
        this.scheduleDailyMailing(); 
    }
}