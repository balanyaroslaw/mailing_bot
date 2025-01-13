"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyOptionsButton = exports.replyCompleteButton = exports.replySubscribeButton = void 0;
var subscribe_enum_1 = require("../keys/enums/subscribe.enum");
exports.replySubscribeButton = {
    reply_markup: {
        keyboard: [
            [{
                    text: subscribe_enum_1.AnswerStates.SUBSCRIBE,
                }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
    },
};
exports.replyCompleteButton = {
    reply_markup: {
        keyboard: [
            [{
                    text: subscribe_enum_1.AnswerStates.COMPLETE,
                }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
        remove_keyboard: true,
    },
};
exports.replyOptionsButton = {
    reply_markup: {
        keyboard: [
            [{
                    text: subscribe_enum_1.SubscribeStates.UNSUBSCRIBE,
                }],
            [{
                    text: subscribe_enum_1.SubscribeStates.AGAIN,
                }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
        remove_keyboard: true,
    },
};
