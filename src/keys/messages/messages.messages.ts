import { Mysteria } from "../../models/mysteria.model";

export const EnterMessages = {
    enter_message:'Це бот помічник, котрий тобі допоможе'
}

export const profileMessage = (name:string, email:string, mysteria:string) => {
    return `
    Ваше ім'я: ${name}\nВаша електронна пошта: ${email}\nВаша таємниця: ${mysteria}`;
}

export const dailyMessage = (data:string | null):string=>{
    if(data === null) return 'Ти молився сьогодні?';

    return data;
}

export const updatedMysteria = (data: Mysteria) => {
    return `Ваша таємниця на цей місяць: ${data.text}\n\n«${data.comment_text}»`;
};
