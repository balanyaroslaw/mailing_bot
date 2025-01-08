
export enum SubscribeStates {
    UNSUBSCRIBE = 'Відписатися',
    ASK_NAME = 'Як вас звати?',
    ASK_EMAIL = 'Яка ваша електрона пошта',
    ASK_MYSTERIA = 'Виберіть тамєницю, що ви молитеся зараз',
    ASK_COMPLETE = 'Все вірно?',
    SUBSCRIBE = 'Підписатися',
    AGAIN = 'Заповнити заново',
    VIEW = 'Переглянути дані'
}

export enum AnswerStates {
    UNSUBSCRIBE = 'Відписатися',
    RECORD_NAME = "Ім'я записане",
    RECORD_EMAIL = 'Електронна адреса записана',
    RECORD_MYSTERIA = 'Таємниця записана',
    SUBSCRIBE = 'Підписатися',
    COMPLETE = 'Все вірно',
    END = 'Реєстрація завершена',
    END_UNSUBSCRIBING = 'Ви відписані'
}
