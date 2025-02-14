
export enum SubscribeStates {
    UNSUBSCRIBE = 'Відписатися',
    ASK_NAME = `Введіть ваше повне ім'я?`,
    ASK_EMAIL = 'Яка ваша електрона пошта',
    ASK_MYSTERIA = 'Виберіть тамєницю, що ви молитеся зараз',
    ASK_COMPLETE = 'Все вірно?',
    SUBSCRIBE = 'Підписатися',
    AGAIN = 'Заповнити заново',
    VIEW = 'Переглянути дані',
    UPDATE = 'Ваші дані оновлені',
    RESTART = 'Обновити бота'
}

export enum AnswerStates {
    UNSUBSCRIBE = 'Відписатися',
    RECORD_NAME = "Ім'я записане",
    RECORD_EMAIL = 'Електронна адреса записана',
    RECORD_MYSTERIA = 'Таємниця записана',
    SUBSCRIBE = 'Підписатися',
    COMPLETE = 'Закінчити реєстрацію',
    END = 'Реєстрація завершена',
    END_UNSUBSCRIBING = 'Ви відписані'
}
