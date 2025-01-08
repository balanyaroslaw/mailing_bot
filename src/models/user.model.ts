import { IUser } from "../interfaces/user.interface";
import { Mysteria } from "./mysteria.model";

export class User implements Omit<IUser,'id'>{
    public id:number | null = null;
    public name:string;
    public email:string;
    public tgId:number | null;
    public mysteria: Mysteria;

    constructor(name:string, email:string, tgId:number | null, mysteria:Mysteria, id?:number){
        this.name = name;
        this.email = email;
        this.tgId = tgId;
        this.mysteria = mysteria;

        if(id){
            this.id = id;
        }
    }   

}