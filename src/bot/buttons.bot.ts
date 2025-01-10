import { AnswerStates, SubscribeStates } from "../keys/enums/subscribe.enum";

export const replySubscribeButton = {
    reply_markup: {
      keyboard: [
        [{ 
            text: AnswerStates.SUBSCRIBE,
        }],  
      ],
      resize_keyboard: true,
      one_time_keyboard: true, 
    },
};

export const replyCompleteButton = {
  reply_markup: {
    keyboard: [
      [{ 
          text: AnswerStates.COMPLETE,
      }],  
    ],
    resize_keyboard: true,
    one_time_keyboard: true, 
    remove_keyboard: true,
  },
};

export const replyOptionsButton = {
  reply_markup: {
    keyboard: [
      [{ 
          text: SubscribeStates.UNSUBSCRIBE,
      }],  
      [{ 
        text: SubscribeStates.AGAIN,
      }],
    ],
    resize_keyboard: true,
    one_time_keyboard: true, 
    remove_keyboard: true,
  },
};


