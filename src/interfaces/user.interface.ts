import { Mysteria } from "./mysteria.interface"

export interface IUser {
    id:number,
    name:string,
    email:string | null,
    tgId:number | null
    mysteria: Omit<Mysteria,'id'>
}