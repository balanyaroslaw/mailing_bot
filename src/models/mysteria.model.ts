import { IMysteria } from "../interfaces/mysteria.interface";

export class Mysteria implements IMysteria {
    mysteries_id?: number;
    text: string;

    constructor(text: string, mysteries_id?: number, ) {
        if(mysteries_id){
            this.mysteries_id = mysteries_id;
        }
        this.text = text;
    }
}