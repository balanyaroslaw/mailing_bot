import { Bot } from "./bot";
import dotenv from 'dotenv';
import { Database } from "./sql/db";
import { UserService } from "./services/user.service";
import { MysteriaService } from "./services/mysteria.service";

dotenv.config();

const telegramToken = process.env.TELEGRAM_TOKEN!;

const botInstance = Bot.getInstance(telegramToken);