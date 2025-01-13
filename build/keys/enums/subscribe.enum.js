"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerStates = exports.SubscribeStates = void 0;
var SubscribeStates;
(function (SubscribeStates) {
    SubscribeStates["UNSUBSCRIBE"] = "\u0412\u0456\u0434\u043F\u0438\u0441\u0430\u0442\u0438\u0441\u044F";
    SubscribeStates["ASK_NAME"] = "\u042F\u043A \u0432\u0430\u0441 \u0437\u0432\u0430\u0442\u0438?";
    SubscribeStates["ASK_EMAIL"] = "\u042F\u043A\u0430 \u0432\u0430\u0448\u0430 \u0435\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u0430 \u043F\u043E\u0448\u0442\u0430";
    SubscribeStates["ASK_MYSTERIA"] = "\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044C \u0442\u0430\u043C\u0454\u043D\u0438\u0446\u044E, \u0449\u043E \u0432\u0438 \u043C\u043E\u043B\u0438\u0442\u0435\u0441\u044F \u0437\u0430\u0440\u0430\u0437";
    SubscribeStates["ASK_COMPLETE"] = "\u0412\u0441\u0435 \u0432\u0456\u0440\u043D\u043E?";
    SubscribeStates["SUBSCRIBE"] = "\u041F\u0456\u0434\u043F\u0438\u0441\u0430\u0442\u0438\u0441\u044F";
    SubscribeStates["AGAIN"] = "\u0417\u0430\u043F\u043E\u0432\u043D\u0438\u0442\u0438 \u0437\u0430\u043D\u043E\u0432\u043E";
    SubscribeStates["VIEW"] = "\u041F\u0435\u0440\u0435\u0433\u043B\u044F\u043D\u0443\u0442\u0438 \u0434\u0430\u043D\u0456";
    SubscribeStates["UPDATE"] = "\u0412\u0430\u0448\u0456 \u0434\u0430\u043D\u0456 \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u0456";
    SubscribeStates["RESTART"] = "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u0438 \u0431\u043E\u0442\u0430";
})(SubscribeStates || (exports.SubscribeStates = SubscribeStates = {}));
var AnswerStates;
(function (AnswerStates) {
    AnswerStates["UNSUBSCRIBE"] = "\u0412\u0456\u0434\u043F\u0438\u0441\u0430\u0442\u0438\u0441\u044F";
    AnswerStates["RECORD_NAME"] = "\u0406\u043C'\u044F \u0437\u0430\u043F\u0438\u0441\u0430\u043D\u0435";
    AnswerStates["RECORD_EMAIL"] = "\u0415\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u0430 \u0430\u0434\u0440\u0435\u0441\u0430 \u0437\u0430\u043F\u0438\u0441\u0430\u043D\u0430";
    AnswerStates["RECORD_MYSTERIA"] = "\u0422\u0430\u0454\u043C\u043D\u0438\u0446\u044F \u0437\u0430\u043F\u0438\u0441\u0430\u043D\u0430";
    AnswerStates["SUBSCRIBE"] = "\u041F\u0456\u0434\u043F\u0438\u0441\u0430\u0442\u0438\u0441\u044F";
    AnswerStates["COMPLETE"] = "\u0412\u0441\u0435 \u0432\u0456\u0440\u043D\u043E";
    AnswerStates["END"] = "\u0420\u0435\u0454\u0441\u0442\u0440\u0430\u0446\u0456\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430";
    AnswerStates["END_UNSUBSCRIBING"] = "\u0412\u0438 \u0432\u0456\u0434\u043F\u0438\u0441\u0430\u043D\u0456";
})(AnswerStates || (exports.AnswerStates = AnswerStates = {}));
