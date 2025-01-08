import TelegramBot from "node-telegram-bot-api";
import {replyCompleteButton, replyOptionsButton, replySubscribeButton} from "./buttons.bot";
import { EnterMessages, profileMessage } from "../keys/messages/messages.messages";
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

export class Bot {
    private static instance: Bot;
    private bot: TelegramBot;
    private subscribinState: SubscribeStates;
    private user:User= new User('', '', null, {} as Mysteria);
    private mysteriaController:MysteriaController;
    private userController:UserController;

    constructor(private token: string) {
        this.mysteriaController = new MysteriaController(new MysteriaService(new Database));
        this.userController = new UserController(new UserService(new Database));
        this.bot = new TelegramBot(token, { polling: true });
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
        this.user.tgId = chatId;
    
        if(this.subscribinState !== SubscribeStates.UNSUBSCRIBE) {
            if (text === SubscribeStates.SUBSCRIBE) {
                this.bot.sendMessage(chatId, SubscribeStates.ASK_NAME);
                this.subscribinState = SubscribeStates.ASK_NAME;
            } 
            else if (this.subscribinState === SubscribeStates.ASK_NAME) {
                this.user.name = text;
                this.bot.sendMessage(chatId, `${AnswerStates.RECORD_NAME}: ${text} \n${SubscribeStates.ASK_EMAIL}`);
                this.subscribinState = SubscribeStates.ASK_EMAIL;
            }
            else if(this.subscribinState === SubscribeStates.ASK_EMAIL) {
                this.user.email = text;
                this.mysteriaController.getAllMysteries()
                .then(mysteriesKeyboard => {
                    this.bot.sendMessage(chatId, `${AnswerStates.RECORD_EMAIL}: ${text} \n${SubscribeStates.ASK_MYSTERIA}`, mysteriesKeyboard);
                })
                .finally(() => this.subscribinState = SubscribeStates.ASK_MYSTERIA);
            }
            else if(this.subscribinState === SubscribeStates.ASK_MYSTERIA) {
                this.user.mysteria = new Mysteria(text, UtilitesBot.getId(text));
                this.user.mysteria.text = text; 
                this.bot.sendMessage(chatId, profileMessage(this.user.name, this.user.email, this.user.mysteria.text), replyCompleteButton);
                this.subscribinState = SubscribeStates.ASK_COMPLETE;
            }
    
            if(text === AnswerStates.COMPLETE){
                this.userController.addNewUser(this.user).finally(()=>this.bot.sendMessage(chatId, AnswerStates.END, replyOptionsButton))
            }
        }
    
        if(text === SubscribeStates.AGAIN){
            this.user = {} as User;
            this.subscribinState = SubscribeStates.SUBSCRIBE;
            this.bot.sendMessage(chatId, SubscribeStates.ASK_NAME);
            this.subscribinState = SubscribeStates.ASK_NAME;
        }
    }

    private handleDelete(msg: TelegramBot.Message):void{
        const chatId = msg.chat.id;
        const text = msg.text!;
        console.log(this.subscribinState)
        if(text === SubscribeStates.UNSUBSCRIBE){
            this.userController.deleteUser(this.user).then(()=>{
                this.bot.sendMessage(chatId, AnswerStates.END_UNSUBSCRIBING)
                this.user = {} as User;
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
    
}