import { IMysteria } from "../interfaces/mysteria.interface";

export class Mysteria implements IMysteria {
    mysteries_id?: number;
    text: string;
    comment_text?:string;

    constructor(text: string, mysteries_id?: number, comment_text?:string) {
        if(mysteries_id){
            this.mysteries_id = mysteries_id;
        }

        if(comment_text){
            this.comment_text = comment_text;
        }
        this.text = text;
    }
}