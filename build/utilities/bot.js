"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilitesBot = void 0;
var UtilitesBot = /** @class */ (function () {
    function UtilitesBot() {
    }
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
