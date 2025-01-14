"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
var node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
var buttons_bot_1 = require("./buttons.bot");
var messages_messages_1 = require("../keys/messages/messages.messages");
var subscribe_enum_1 = require("../keys/enums/subscribe.enum");
var user_model_1 = require("../models/user.model");
var mysteria_model_1 = require("../models/mysteria.model");
var mysteria_controller_1 = require("../controllers/bot/mysteria.controller");
var mysteria_service_1 = require("../services/mysteria.service");
var db_1 = require("../sql/db");
var bot_1 = require("../utilities/bot");
var user_controller_1 = require("../controllers/bot/user.controller");
var user_service_1 = require("../services/user.service");
var Bot = /** @class */ (function () {
    function Bot(token) {
        this.token = token;
        this.user = new user_model_1.User('', '', null, {});
        this.userSession = new Map();
        this.mysteriaController = new mysteria_controller_1.MysteriaController(new mysteria_service_1.MysteriaService(new db_1.Database));
        this.userController = new user_controller_1.UserController(new user_service_1.UserService(new db_1.Database));
        this.bot = new node_telegram_bot_api_1.default(token, {
            polling: {
                interval: 300,
                autoStart: true,
                params: {
                    timeout: 10,
                },
            },
        });
        this.subscribinState = subscribe_enum_1.SubscribeStates.SUBSCRIBE;
        this.initialize();
    }
    Bot.getInstance = function (token) {
        if (!Bot.instance) {
            Bot.instance = new Bot(token);
        }
        return Bot.instance;
    };
    Bot.prototype.initialize = function () {
        var _this = this;
        this.bot.onText(/\/start/, function (msg) { return _this.handleStartCommand(msg); });
        this.bot.on('message', function (msg) { return _this.handleSubscribing(msg); });
        this.bot.on('message', function (msg) { return _this.handleDelete(msg); });
    };
    Bot.prototype.handleStartCommand = function (msg) {
        var chatId = msg.chat.id;
        this.subscribinState = subscribe_enum_1.SubscribeStates.SUBSCRIBE;
        if (this.subscribinState === subscribe_enum_1.SubscribeStates.SUBSCRIBE) {
            this.bot.sendMessage(chatId, messages_messages_1.EnterMessages.enter_message, buttons_bot_1.replySubscribeButton);
        }
        else {
            this.bot.sendMessage(chatId, '');
        }
    };
    Bot.prototype.handleSubscribing = function (msg) {
        var _this = this;
        var chatId = msg.chat.id;
        var text = msg.text;
        this.userSession.set(chatId, this.user);
        if (this.subscribinState !== subscribe_enum_1.SubscribeStates.UNSUBSCRIBE) {
            if (text === subscribe_enum_1.SubscribeStates.SUBSCRIBE) {
                this.bot.sendMessage(chatId, subscribe_enum_1.SubscribeStates.ASK_NAME);
                this.subscribinState = subscribe_enum_1.SubscribeStates.ASK_NAME;
            }
            else if (this.subscribinState === subscribe_enum_1.SubscribeStates.ASK_NAME) {
                this.userSession.get(chatId).name = text;
                this.bot.sendMessage(chatId, "".concat(subscribe_enum_1.AnswerStates.RECORD_NAME, ": ").concat(text, " \n").concat(subscribe_enum_1.SubscribeStates.ASK_EMAIL));
                this.subscribinState = subscribe_enum_1.SubscribeStates.ASK_EMAIL;
            }
            else if (this.subscribinState === subscribe_enum_1.SubscribeStates.ASK_EMAIL) {
                this.userSession.get(chatId).email = text;
                this.mysteriaController.getAllMysteries()
                    .then(function (mysteriesKeyboard) {
                    _this.bot.sendMessage(chatId, "".concat(subscribe_enum_1.AnswerStates.RECORD_EMAIL, ": ").concat(text, " \n").concat(subscribe_enum_1.SubscribeStates.ASK_MYSTERIA), mysteriesKeyboard);
                })
                    .catch(function (error) { return console.log(error); })
                    .finally(function () { return _this.subscribinState = subscribe_enum_1.SubscribeStates.ASK_MYSTERIA; });
            }
            else if (this.subscribinState === subscribe_enum_1.SubscribeStates.ASK_MYSTERIA) {
                this.userSession.get(chatId).mysteria = new mysteria_model_1.Mysteria(text, bot_1.UtilitesBot.getId(text));
                this.userSession.get(chatId).mysteria.text = text;
                this.bot.sendMessage(chatId, (0, messages_messages_1.profileMessage)(this.userSession.get(chatId).name, this.userSession.get(chatId).email, this.userSession.get(chatId).mysteria.text), buttons_bot_1.replyCompleteButton);
                this.subscribinState = subscribe_enum_1.SubscribeStates.ASK_COMPLETE;
            }
            if (text === subscribe_enum_1.AnswerStates.COMPLETE) {
                this.userController.getUser(chatId).then(function (existedUser) {
                    if (existedUser) {
                        _this.userController.updateUser(_this.userSession.get(chatId))
                            .then(function () {
                            _this.bot.sendMessage(chatId, subscribe_enum_1.SubscribeStates.UPDATE, buttons_bot_1.replyOptionsButton);
                            _this.user = new user_model_1.User('', '', null, {});
                            _this.userSession.delete(chatId);
                        })
                            .catch(function (error) { return console.log(error); });
                    }
                    else {
                        _this.userController.addNewUser(_this.userSession.get(chatId))
                            .catch(function (error) { return console.log(error); })
                            .finally(function () {
                            _this.bot.sendMessage(chatId, subscribe_enum_1.AnswerStates.END, buttons_bot_1.replyOptionsButton);
                            _this.user = new user_model_1.User('', '', null, {});
                            _this.userSession.delete(chatId);
                        });
                    }
                });
            }
        }
        if (text === subscribe_enum_1.SubscribeStates.AGAIN) {
            this.user = new user_model_1.User('', '', null, {});
            this.userSession.delete(chatId);
            this.userSession.set(chatId, this.user);
            this.subscribinState = subscribe_enum_1.SubscribeStates.SUBSCRIBE;
            this.bot.sendMessage(chatId, subscribe_enum_1.SubscribeStates.ASK_NAME);
            this.subscribinState = subscribe_enum_1.SubscribeStates.ASK_NAME;
        }
    };
    Bot.prototype.handleDelete = function (msg) {
        var _this = this;
        var chatId = msg.chat.id;
        var text = msg.text;
        console.log(this.subscribinState);
        console.log(this.userSession.get(chatId));
        if (text === subscribe_enum_1.SubscribeStates.UNSUBSCRIBE) {
            this.userController.deleteUser(this.user).then(function () {
                _this.bot.sendMessage(chatId, subscribe_enum_1.AnswerStates.END_UNSUBSCRIBING);
                _this.user = new user_model_1.User('', '', null, {});
                _this.userSession.delete(chatId);
                _this.subscribinState = subscribe_enum_1.SubscribeStates.SUBSCRIBE;
                if (_this.subscribinState === subscribe_enum_1.SubscribeStates.SUBSCRIBE) {
                    _this.bot.sendMessage(chatId, messages_messages_1.EnterMessages.enter_message, buttons_bot_1.replySubscribeButton);
                }
                else {
                    _this.bot.sendMessage(chatId, '');
                }
            });
        }
    };
    Bot.prototype.handleUpdateMysteries = function (chatId) {
        var _this = this;
        if (new Date().getDate() === 1) {
            this.mysteriaController.updateMysteries().then(function () {
                _this.userController.getUser(chatId).then(function (user) {
                    _this.mysteriaController.getMysteriaById(user === null || user === void 0 ? void 0 : user.mysteries_id).then(function (mysteria) {
                        _this.bot.sendMessage(chatId, (0, messages_messages_1.updatedMysteria)(mysteria));
                    }).catch(function (error) { return console.log(error); });
                }).catch(function (error) { return console.log(error); });
            }).catch(function (error) { return console.log(error); });
        }
    };
    Bot.prototype.Mailing = function () {
        var _this = this;
        this.userController.getAllUsers().then(function (users) {
            for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
                var user = users_1[_i];
                if (user.tg_id) {
                    _this.bot.sendMessage(user.tg_id, (0, messages_messages_1.dailyMessage)());
                    _this.handleUpdateMysteries(user.tg_id);
                }
            }
        }).catch(function (error) { return console.log(error); });
        ;
    };
    Bot.prototype.scheduleDailyMailing = function () {
        var _this = this;
        var now = new Date();
        var next3PM = new Date();
        next3PM.setHours(15, 0, 0, 0);
        if (now > next3PM) {
            next3PM.setDate(next3PM.getDate() + 1);
        }
        var delay = next3PM.getTime() - now.getTime();
        setTimeout(function () {
            _this.Mailing();
            _this.scheduleDailyMailing();
        }, delay);
    };
    Bot.prototype.Start = function () {
        this.scheduleDailyMailing();
    };
    return Bot;
}());
exports.Bot = Bot;
