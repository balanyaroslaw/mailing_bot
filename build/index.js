"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var bot_1 = require("./bot");
dotenv_1.default.config();
var Server = /** @class */ (function () {
    function Server() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || 3000;
        this.setupRoutes();
    }
    Server.prototype.setupRoutes = function () {
        this.app.get('/', function (req, res) {
            res.send('for heroku only');
        });
    };
    Server.prototype.start = function () {
        var _this = this;
        this.app.listen(this.port, function () {
            console.log("Server is running on port ".concat(_this.port));
        });
    };
    return Server;
}());
var TelegramBot = /** @class */ (function () {
    function TelegramBot(token) {
        this.token = token;
        this.botInstance = bot_1.Bot.getInstance(this.token);
    }
    TelegramBot.prototype.start = function () {
        this.botInstance.Start();
    };
    return TelegramBot;
}());
var Application = /** @class */ (function () {
    function Application() {
        var telegramToken = process.env.TELEGRAM_TOKEN;
        if (!telegramToken) {
            throw new Error('TELEGRAM_TOKEN is not defined in environment variables.');
        }
        this.server = new Server();
        this.bot = new TelegramBot(telegramToken);
    }
    Application.prototype.start = function () {
        this.server.start();
        this.bot.start();
    };
    return Application;
}());
var app = new Application();
app.start();
