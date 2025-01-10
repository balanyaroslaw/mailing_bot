import { Bot } from "./bot";
import dotenv from 'dotenv';

dotenv.config();

const telegramToken = process.env.TELEGRAM_TOKEN!;

const botInstance = Bot.getInstance(telegramToken);
botInstance.Start();