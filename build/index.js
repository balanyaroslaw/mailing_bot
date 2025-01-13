"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bot_1 = require("./bot");
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
dotenv_1.default.config();
var app = (0, express_1.default)();
var port = process.env.PORT || 3000;
console.log(port);
app.get('/', function (req, res) {
    res.send('port');
});
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
var telegramToken = process.env.TELEGRAM_TOKEN;
var botInstance = bot_1.Bot.getInstance(telegramToken);
botInstance.Start();
