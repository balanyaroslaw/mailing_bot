"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bot_1 = require("./bot");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var telegramToken = process.env.TELEGRAM_TOKEN;
var botInstance = bot_1.Bot.getInstance(telegramToken);
botInstance.Start();
