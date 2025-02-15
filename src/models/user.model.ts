import { IUser } from "../interfaces/user.interface";
import { AnswerStates, SubscribeStates } from "../keys/enums/subscribe.enum";
import { Mysteria } from "./mysteria.model";

export class User implements Omit<IUser,'id'>{
    public id:number | null = null;
    public name:string;
    public email:string;
    public tg_id:number | null;
    public mysteria: Mysteria;
    public mysteries_id?: number | undefined;
    public subscribinState?: SubscribeStates | AnswerStates | null;

    constructor(name:string, email:string, tg_id:number | null, mysteria:Mysteria, id?:number, mysteries_id?:number){
        this.name = name;
        this.email = email;
        this.tg_id = tg_id;
        this.mysteria = mysteria;
        
        if(id){
            this.id = id;
        }

        if(mysteries_id){
            this.mysteries_id = mysteries_id;
        }
    }   

}