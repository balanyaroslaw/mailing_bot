import TelegramBot from "node-telegram-bot-api";
import {replyCompleteButton, replyOptionsButton, replySubscribeButton} from "./buttons.bot";
import { dailyMessage, EnterMessages, profileMessage, updatedMysteria } from "../keys/messages/messages.messages";
import { AnswerStates, SubscribeStates } from "../keys/enums/subscribe.enum";
import { User } from "../models/user.model";
import { Mysteria } from "../models/mysteria.model";
import { MysteriaController } from "../controllers/bot/mysteria.controller";
import { MysteriaService } from "../services/mysteria.service";
import { Database } from "../sql/db";
import { UtilitesBot } from "../utilities/bot";
import { UserController } from "../controllers/bot/user.controller";
import { UserService } from "../services/user.service";
import { MessageController } from "../controllers/bot/message.controller";
import { MessageService } from "../services/message.service";
export class Bot {
    private static instance: Bot;
    private bot: TelegramBot;
    private subscribinState: SubscribeStates;
    private user:User= new User('', '', null, {} as Mysteria);
    private mysteriaController:MysteriaController;
    private userController:UserController;
    private messageController:MessageController;
    private userSession:Map<number, User> = new Map<number, User>();

    constructor(private token: string) {
        this.mysteriaController = new MysteriaController(new MysteriaService(new Database));
        this.userController = new UserController(new UserService(new Database));
        this.messageController = new MessageController(new MessageService(new Database));
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

    private async handleSubscribing(msg: TelegramBot.Message): Promise<void> {
        try {
            const chatId = msg.chat.id;
            const text = msg.text!;
            this.userSession.set(chatId, this.user);
            this.userSession.get(chatId)!.tg_id = chatId;
    
            if (this.subscribinState !== SubscribeStates.UNSUBSCRIBE) {
                if (text === SubscribeStates.SUBSCRIBE) {
                    this.bot.sendMessage(chatId, SubscribeStates.ASK_NAME);
                    this.subscribinState = SubscribeStates.ASK_NAME;
                } 
                else if (this.subscribinState === SubscribeStates.ASK_NAME) {
                    this.userSession.get(chatId)!.name = text;
                    this.bot.sendMessage(chatId, `${AnswerStates.RECORD_NAME}: ${text} \n${SubscribeStates.ASK_EMAIL}`);
                    this.subscribinState = SubscribeStates.ASK_EMAIL;
                }
                else if (this.subscribinState === SubscribeStates.ASK_EMAIL) {
                    this.userSession.get(chatId)!.email = text;
                    try {
                        const mysteriesKeyboard = await this.mysteriaController.getAllMysteries();
                        this.bot.sendMessage(chatId, `${AnswerStates.RECORD_EMAIL}: ${text} \n${SubscribeStates.ASK_MYSTERIA}`, mysteriesKeyboard);
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.subscribinState = SubscribeStates.ASK_MYSTERIA;
                    }
                }
                else if (this.subscribinState === SubscribeStates.ASK_MYSTERIA) {
                    this.userSession.get(chatId)!.mysteria = new Mysteria(text, UtilitesBot.getId(text));
                    this.userSession.get(chatId)!.mysteria.text = text;
                    this.bot.sendMessage(
                        chatId, 
                        profileMessage(
                            this.userSession.get(chatId)!.name, 
                            this.userSession.get(chatId)!.email, 
                            this.userSession.get(chatId)!.mysteria.text
                        ), 
                        replyCompleteButton
                    );
                    this.subscribinState = SubscribeStates.ASK_COMPLETE;
                }
    
                if (text === AnswerStates.COMPLETE) {
                    try {
                        const existedUser = await this.userController.getUser(chatId);
                        if (existedUser) {
                            await this.userController.updateUser(this.userSession.get(chatId)!);
                            this.bot.sendMessage(chatId, SubscribeStates.UPDATE, replyOptionsButton);
                        } else {
                            await this.userController.addNewUser(this.userSession.get(chatId)!);
                            this.bot.sendMessage(chatId, AnswerStates.END, replyOptionsButton);
                        }
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.user = new User('', '', null, {} as Mysteria);
                        this.userSession.delete(chatId);
                    }
                }
            }
    
            if (text === SubscribeStates.AGAIN) {
                this.user = new User('', '', null, {} as Mysteria);
                this.userSession.delete(chatId);
                this.userSession.set(chatId, this.user);
                this.subscribinState = SubscribeStates.ASK_NAME;
                this.bot.sendMessage(chatId, SubscribeStates.ASK_NAME);
            }
        } catch (error) {
            console.error(error);
        }
    }


    private async handleDelete(msg: TelegramBot.Message): Promise<void> {
        try {
            const chatId = msg.chat.id;
            const text = msg.text!;
            
            console.log(this.subscribinState);
            console.log(this.userSession.get(chatId));
    
            if (text === SubscribeStates.UNSUBSCRIBE) {
                await this.userController.deleteUser(this.user);
                
                this.bot.sendMessage(chatId, AnswerStates.END_UNSUBSCRIBING);
                
                this.user = new User('', '', null, {} as Mysteria);
                this.userSession.delete(chatId);
                this.subscribinState = SubscribeStates.SUBSCRIBE;
    
                const message = this.subscribinState === SubscribeStates.SUBSCRIBE 
                    ? EnterMessages.enter_message 
                    : '';
                this.bot.sendMessage(chatId, message, replySubscribeButton);
            }
        } catch (error) {
            console.error(error);
        }
    }

    private async handleUpdateMysteries(): Promise<void> {
        try {
            if (new Date().getDate() !== 1) return;

            await this.mysteriaController.updateMysteries();
            const users = await this.userController.getAllUsers();
    
            for (const user of users) {
                if (!user.tg_id) continue;
    
                try {
                    const userData = await this.userController.getUser(user.tg_id);
                    if (!userData?.mysteries_id) continue;
    
                    const mysteria = await this.mysteriaController.getMysteriaById(userData.mysteries_id);
                    await this.bot.sendMessage(user.tg_id, updatedMysteria(mysteria));
                } catch (error) {
                    console.error(`Error processing user ${user.tg_id}:`, error);
                }
            }
        } catch (error) {
            console.error("Error updating mysteries:", error);
        }
    }

    private async Mailing(): Promise<void> {
        const now = new Date();
        try {
            this.handleUpdateMysteries();
            const users = await this.userController.getAllUsers();
            const message = await this.messageController.getDailyMessage();
            for (const user of users) {
                if (user.tg_id) {
                    await this.bot.sendMessage(user.tg_id, dailyMessage(message));
                }
            }

            if(UtilitesBot.getDaysInMonth(now.getFullYear(), now.getMonth()) === now.getDate()){
                await this.messageController.resetDailyMessage();
            }

        } catch (error) {
            console.error(error);
        }
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