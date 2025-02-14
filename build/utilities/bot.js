"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilitesBot = void 0;
var UtilitesBot = /** @class */ (function () {
    function UtilitesBot() {
    }
    UtilitesBot.getDaysInMonth = function (year, month) {
        return new Date(year, month + 1, 0).getDate();
    };
    UtilitesBot.formatMessage = function (data) {
        var _a = data.split('. – '), article = _a[0], author = _a[1];
        return "".concat(article, ". \n\u00A9 ").concat(author);
    };
    UtilitesBot.keyboard = function (rows, array) {
        var resultArray = [];
        for (var i = 0; i < array.length; i += rows) {
            resultArray.push(array.slice(i, i + rows).map(function (e) { return ({ text: e }); }));
        }
        var resultKeyboard = {
            reply_markup: {
                keyboard: resultArray,
                resize_keyboard: true,
                one_time_keyboard: true,
                remove_keyboard: true,
            },
        };
        return resultKeyboard;
    };
    UtilitesBot.getId = function (data) {
        return +data.split('.')[0];
    };
    return UtilitesBot;
}());
exports.UtilitesBot = UtilitesBot;
