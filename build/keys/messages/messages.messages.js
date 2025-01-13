"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedMysteria = exports.dailyMessage = exports.profileMessage = exports.EnterMessages = void 0;
exports.EnterMessages = {
    enter_message: 'Це бот помічник, котрий тобі допоможе'
};
var profileMessage = function (name, email, mysteria) {
    return "\n    \u0412\u0430\u0448\u0435 \u0456\u043C'\u044F: ".concat(name, "\n\u0412\u0430\u0448\u0430 \u0435\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u0430 \u043F\u043E\u0448\u0442\u0430: ").concat(email, "\n\u0412\u0430\u0448\u0430 \u0442\u0430\u0454\u043C\u043D\u0438\u0446\u044F: ").concat(mysteria);
};
exports.profileMessage = profileMessage;
var dailyMessage = function () {
    return 'Ти молився сьогодні?';
};
exports.dailyMessage = dailyMessage;
var updatedMysteria = function (data) {
    return "\u0412\u0430\u0448\u0430 \u043D\u043E\u0432\u0430 \u0442\u0430\u0454\u043C\u043D\u0438\u0446\u044F: ".concat(data.text);
};
exports.updatedMysteria = updatedMysteria;
