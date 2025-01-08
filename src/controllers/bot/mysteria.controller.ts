import { Mysteria } from "../../models/mysteria.model";
import { MysteriaService } from "../../services/mysteria.service";
import { UtilitesBot } from "../../utilities/bot";

export class MysteriaController{
    constructor(private mysteriesService:MysteriaService){}

    async getAllMysteries(){
        const mysteries = await this.mysteriesService.getMysteries();
        const textOfMysteries = mysteries.map(e=>`${e.mysteries_id}. ${e.text}`)
        const replyKeyboard = UtilitesBot.keyboard(2, textOfMysteries)
        return replyKeyboard;
    }
}