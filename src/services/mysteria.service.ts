import { IUser } from "../interfaces/user.interface";
import { IUserService } from "../interfaces/user.service.interface";
import { Mysteria } from "../models/mysteria.model";
import { User } from "../models/user.model";
import { Database } from "../sql/db";
import { Queries } from "../sql/queries";

export class MysteriaService{
    private db:Database;
    
    constructor(database:Database){
        this.db = database;
    }
    
    async getMysteries(): Promise<Mysteria[]> {
      const result = await this.db.query<Mysteria>(Queries.GET_MYSTERIES);
      return result.rows as Mysteria[];
    }

    async getMysteriaById(id:number): Promise<Mysteria> {
        const result = await this.db.query<Mysteria>(Queries.GET_MYSTERIA, [id]);
        return result.rows[0] as Mysteria;
      }
    
    async updateMysteria():Promise<void>{
        await this.db.query<Mysteria>(Queries.UPDATE_MYSTERIES);
      }

  }