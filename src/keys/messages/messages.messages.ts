
export const EnterMessages = {
    enter_message:'Це бот помічник, котрий тобі допоможе'
}

export const profileMessage = (name:string, email:string, mysteria:string) => {
    return `
    Ваше ім'я: ${name}\nВаша електронна пошта: ${email}\nВаша таємниця: ${mysteria}`;
}

export const dailyMessage = ():string =>{
    return 'Ти молився сьогодні?'
}