import { Mysteria } from "../../models/mysteria.model";
import { UtilitesBot } from "../../utilities/bot";

export const EnterMessages = {
    enter_message:'Це бот помічник, котрий тобі допоможе не забувати щодня молитися таємницю Розарію та вчасно її змінювати\n\nЯк нагадування, щодня ви будете отримувати цитати святих для підтримки мотивації'
}

export const profileMessage = (name:string, email:string, mysteria:string) => {
    return `
    Ваше ім'я: ${name}\nВаша електронна пошта: ${email}\nВаша таємниця: ${mysteria}`;
}

export const dailyMessage = (data:string | null):string=>{
    if(data === null) return 'Ти молився сьогодні?';

    return UtilitesBot.formatMessage(data);
}

export const updatedMysteria = (data: Mysteria) => {
    return `Ваша таємниця на цей місяць: ${data.text}\n\n«${data.comment_text}»`;
};

export const initialMessage = () =>{
    return `
Про всяк випадок нагадуємо вам як молитись десяточок.

Назвавши конкретну Таємницю (прочитавши уривок коментаря), молимося конкретний десяточок. 

На одній намистині: Отче наш… 
На десяти маленьких: Радуйся, Маріє… 
Після чого додаємо: Слава Отцю, і Сину, і Святому Духу, як було на початку, нині і повсякчас, і на віки вічні. Амінь.

А також: О Маріє, без первородного гріха зачата, Молись за нас, що до Тебе прибігаємо.

Фатімська молитва: 
О Ісусе, прости нам гріхи наші, спаси нас від вогню пекельного, приведи на небо всі душі, а особливо ті, які найбільше потребують Твого милосердя.
    `
}
