"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var message_controller_1 = require("../controllers/bot/message.controller");
var message_service_1 = require("../services/message.service");
var Bot = /** @class */ (function () {
    function Bot(token) {
        this.token = token;
        this.user = new user_model_1.User('', '', null, {});
        this.userSession = new Map();
        this.mysteriaController = new mysteria_controller_1.MysteriaController(new mysteria_service_1.MysteriaService(new db_1.Database));
        this.userController = new user_controller_1.UserController(new user_service_1.UserService(new db_1.Database));
        this.messageController = new message_controller_1.MessageController(new message_service_1.MessageService(new db_1.Database));
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
        return __awaiter(this, void 0, void 0, function () {
            var chatId, text, mysteriesKeyboard, error_1, existedUser, error_2, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 19, , 20]);
                        chatId = msg.chat.id;
                        text = msg.text;
                        this.userSession.set(chatId, this.user);
                        this.userSession.get(chatId).tg_id = chatId;
                        if (!(this.subscribinState !== subscribe_enum_1.SubscribeStates.UNSUBSCRIBE)) return [3 /*break*/, 18];
                        if (!(text === subscribe_enum_1.SubscribeStates.SUBSCRIBE)) return [3 /*break*/, 1];
                        this.bot.sendMessage(chatId, subscribe_enum_1.SubscribeStates.ASK_NAME);
                        this.subscribinState = subscribe_enum_1.SubscribeStates.ASK_NAME;
                        return [3 /*break*/, 9];
                    case 1:
                        if (!(this.subscribinState === subscribe_enum_1.SubscribeStates.ASK_NAME)) return [3 /*break*/, 2];
                        this.userSession.get(chatId).name = text;
                        this.bot.sendMessage(chatId, "".concat(subscribe_enum_1.AnswerStates.RECORD_NAME, ": ").concat(text, " \n").concat(subscribe_enum_1.SubscribeStates.ASK_EMAIL));
                        this.subscribinState = subscribe_enum_1.SubscribeStates.ASK_EMAIL;
                        return [3 /*break*/, 9];
                    case 2:
                        if (!(this.subscribinState === subscribe_enum_1.SubscribeStates.ASK_EMAIL)) return [3 /*break*/, 8];
                        this.userSession.get(chatId).email = text;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, 6, 7]);
                        return [4 /*yield*/, this.mysteriaController.getAllMysteries()];
                    case 4:
                        mysteriesKeyboard = _a.sent();
                        this.bot.sendMessage(chatId, "".concat(subscribe_enum_1.AnswerStates.RECORD_EMAIL, ": ").concat(text, " \n").concat(subscribe_enum_1.SubscribeStates.ASK_MYSTERIA), mysteriesKeyboard);
                        return [3 /*break*/, 7];
                    case 5:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 7];
                    case 6:
                        this.subscribinState = subscribe_enum_1.SubscribeStates.ASK_MYSTERIA;
                        return [7 /*endfinally*/];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        if (this.subscribinState === subscribe_enum_1.SubscribeStates.ASK_MYSTERIA) {
                            this.userSession.get(chatId).mysteria = new mysteria_model_1.Mysteria(text, bot_1.UtilitesBot.getId(text));
                            this.userSession.get(chatId).mysteria.text = text;
                            this.bot.sendMessage(chatId, (0, messages_messages_1.profileMessage)(this.userSession.get(chatId).name, this.userSession.get(chatId).email, this.userSession.get(chatId).mysteria.text), buttons_bot_1.replyCompleteButton);
                            this.subscribinState = subscribe_enum_1.SubscribeStates.ASK_COMPLETE;
                        }
                        _a.label = 9;
                    case 9:
                        if (!(text === subscribe_enum_1.AnswerStates.COMPLETE)) return [3 /*break*/, 18];
                        _a.label = 10;
                    case 10:
                        _a.trys.push([10, 16, 17, 18]);
                        return [4 /*yield*/, this.userController.getUser(chatId)];
                    case 11:
                        existedUser = _a.sent();
                        if (!existedUser) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.userController.updateUser(this.userSession.get(chatId))];
                    case 12:
                        _a.sent();
                        this.bot.sendMessage(chatId, subscribe_enum_1.SubscribeStates.UPDATE, buttons_bot_1.replyOptionsButton);
                        return [3 /*break*/, 15];
                    case 13: return [4 /*yield*/, this.userController.addNewUser(this.userSession.get(chatId))];
                    case 14:
                        _a.sent();
                        this.bot.sendMessage(chatId, subscribe_enum_1.AnswerStates.END, buttons_bot_1.replyOptionsButton);
                        _a.label = 15;
                    case 15: return [3 /*break*/, 18];
                    case 16:
                        error_2 = _a.sent();
                        console.error(error_2);
                        return [3 /*break*/, 18];
                    case 17:
                        this.user = new user_model_1.User('', '', null, {});
                        this.userSession.delete(chatId);
                        return [7 /*endfinally*/];
                    case 18:
                        if (text === subscribe_enum_1.SubscribeStates.AGAIN) {
                            this.user = new user_model_1.User('', '', null, {});
                            this.userSession.delete(chatId);
                            this.userSession.set(chatId, this.user);
                            this.subscribinState = subscribe_enum_1.SubscribeStates.ASK_NAME;
                            this.bot.sendMessage(chatId, subscribe_enum_1.SubscribeStates.ASK_NAME);
                        }
                        return [3 /*break*/, 20];
                    case 19:
                        error_3 = _a.sent();
                        console.error(error_3);
                        return [3 /*break*/, 20];
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    Bot.prototype.handleDelete = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var chatId, text, message, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        chatId = msg.chat.id;
                        text = msg.text;
                        console.log(this.subscribinState);
                        console.log(this.userSession.get(chatId));
                        if (!(text === subscribe_enum_1.SubscribeStates.UNSUBSCRIBE)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.userController.deleteUser(this.user)];
                    case 1:
                        _a.sent();
                        this.bot.sendMessage(chatId, subscribe_enum_1.AnswerStates.END_UNSUBSCRIBING);
                        this.user = new user_model_1.User('', '', null, {});
                        this.userSession.delete(chatId);
                        this.subscribinState = subscribe_enum_1.SubscribeStates.SUBSCRIBE;
                        message = this.subscribinState === subscribe_enum_1.SubscribeStates.SUBSCRIBE
                            ? messages_messages_1.EnterMessages.enter_message
                            : '';
                        this.bot.sendMessage(chatId, message, buttons_bot_1.replySubscribeButton);
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error(error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Bot.prototype.handleUpdateMysteries = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users, _i, users_1, user, userData, mysteria, error_5, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        if (new Date().getDate() !== 1)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.mysteriaController.updateMysteries()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.userController.getAllUsers()];
                    case 2:
                        users = _a.sent();
                        _i = 0, users_1 = users;
                        _a.label = 3;
                    case 3:
                        if (!(_i < users_1.length)) return [3 /*break*/, 10];
                        user = users_1[_i];
                        if (!user.tg_id)
                            return [3 /*break*/, 9];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 8, , 9]);
                        return [4 /*yield*/, this.userController.getUser(user.tg_id)];
                    case 5:
                        userData = _a.sent();
                        if (!(userData === null || userData === void 0 ? void 0 : userData.mysteries_id))
                            return [3 /*break*/, 9];
                        return [4 /*yield*/, this.mysteriaController.getMysteriaById(userData.mysteries_id)];
                    case 6:
                        mysteria = _a.sent();
                        return [4 /*yield*/, this.bot.sendMessage(user.tg_id, (0, messages_messages_1.updatedMysteria)(mysteria))];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        error_5 = _a.sent();
                        console.error("Error processing user ".concat(user.tg_id, ":"), error_5);
                        return [3 /*break*/, 9];
                    case 9:
                        _i++;
                        return [3 /*break*/, 3];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        error_6 = _a.sent();
                        console.error("Error updating mysteries:", error_6);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Bot.prototype.Mailing = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, users, message, _i, users_2, user, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, , 11]);
                        this.handleUpdateMysteries();
                        return [4 /*yield*/, this.userController.getAllUsers()];
                    case 2:
                        users = _a.sent();
                        return [4 /*yield*/, this.messageController.getDailyMessage()];
                    case 3:
                        message = _a.sent();
                        _i = 0, users_2 = users;
                        _a.label = 4;
                    case 4:
                        if (!(_i < users_2.length)) return [3 /*break*/, 7];
                        user = users_2[_i];
                        if (!user.tg_id) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.bot.sendMessage(user.tg_id, (0, messages_messages_1.dailyMessage)(message))];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        if (!(bot_1.UtilitesBot.getDaysInMonth(now.getFullYear(), now.getMonth()) === now.getDate())) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.messageController.resetDailyMessage()];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_7 = _a.sent();
                        console.error(error_7);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
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
