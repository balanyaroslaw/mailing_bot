import { AnswerStates, SubscribeStates } from "../keys/enums/subscribe.enum"
import { Mysteria } from "../models/mysteria.model"


export interface IUser {
    id:number,
    name:string,
    email:string | null,
    tg_id:number | null
    mysteria: Mysteria
    mysteries_id?:number,
    subscribinState?: SubscribeStates | AnswerStates | null;
}