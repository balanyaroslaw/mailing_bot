import TelegramBot from "node-telegram-bot-api";
import {replyCompleteButton, replyOptionsButton, replySubscribeButton} from "./buttons.bot";
import { dailyMessage, EnterMessages, initialMessage, profileMessage, updatedMysteria } from "../keys/messages/messages.messages";
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
        if(msg.text===SubscribeStates.SUBSCRIBE){
            this.subscribinState = SubscribeStates.SUBSCRIBE;
        }
        this.bot.sendMessage(chatId, EnterMessages.enter_message, replySubscribeButton);
    }

    private async handleSubscribing(msg: TelegramBot.Message): Promise<void> {
        try {
            const chatId = msg.chat.id;
            const text = msg.text!;
    
            if (!this.userSession.has(chatId)) {
                this.userSession.set(chatId, new User('', '', chatId, {} as Mysteria));
            }
    
            const user = this.userSession.get(chatId)!;
    
            if (text === SubscribeStates.SUBSCRIBE) {
                user.subscribinState = SubscribeStates.ASK_NAME;
                await this.bot.sendMessage(chatId, SubscribeStates.ASK_NAME);
                return;
            }
    
            switch (user.subscribinState) {
                case SubscribeStates.ASK_NAME:
                    user.name = text;
                    this.bot.sendMessage(chatId, `${AnswerStates.RECORD_NAME}: ${text} \n${SubscribeStates.ASK_EMAIL}`);
                    user.subscribinState = SubscribeStates.ASK_EMAIL;
                    break;
    
                case SubscribeStates.ASK_EMAIL:
                    user.email = text;
                    try {
                        const mysteriesKeyboard = await this.mysteriaController.getAllMysteries();
                        this.bot.sendMessage(chatId, `${AnswerStates.RECORD_EMAIL}: ${text} \n${SubscribeStates.ASK_MYSTERIA}`, mysteriesKeyboard);
                    } catch (error) {
                        console.error(error);
                    } finally {
                        user.subscribinState = SubscribeStates.ASK_MYSTERIA;
                    }
                    break;
    
                case SubscribeStates.ASK_MYSTERIA:
                    user.mysteria = new Mysteria(text, UtilitesBot.getId(text));
                    this.bot.sendMessage(
                        chatId,
                        profileMessage(user.name, user.email, user.mysteria.text),
                        replyCompleteButton
                    );
                    user.subscribinState = SubscribeStates.ASK_COMPLETE;
                    break;
    
                case SubscribeStates.ASK_COMPLETE:
                    if (text === AnswerStates.COMPLETE) {
                        try {
                            const existedUser = await this.userController.getUser(chatId);
                            if (existedUser) {
                                await this.userController.updateUser(user);
                                this.bot.sendMessage(chatId, SubscribeStates.UPDATE, replyOptionsButton);
                            } else {
                                await this.userController.addNewUser(user);
                                const mysteria = await this.mysteriaController.getMysteriaById(user.mysteria.mysteries_id!);
                                await this.bot.sendMessage(chatId, `${AnswerStates.END} \n${initialMessage()}`, replyOptionsButton);
                                await this.bot.sendMessage(chatId, updatedMysteria(mysteria), replyOptionsButton);
                            }
                        } catch (error) {
                            console.error(error);
                        } finally {
                            this.userSession.delete(chatId);
                        }
                    }
                    break;
            }
    
            if (text === SubscribeStates.AGAIN) {
                this.userSession.set(chatId, new User('', '', chatId, {} as Mysteria));
                this.userSession.get(chatId)!.subscribinState = SubscribeStates.ASK_NAME;
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
    
            console.log("Current subscribe state:", this.userSession.get(chatId)?.subscribinState);
    
            const user = this.userSession.get(chatId)!;
            if (text === SubscribeStates.UNSUBSCRIBE) {
                await this.userController.deleteUser(user);
                this.bot.sendMessage(chatId, AnswerStates.END_UNSUBSCRIBING);
    
                this.userSession.delete(chatId);
    
                this.bot.sendMessage(chatId, EnterMessages.enter_message, replySubscribeButton);
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