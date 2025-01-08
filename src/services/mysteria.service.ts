import { IUser } from "../interfaces/user.interface";
import { IUserService } from "../interfaces/user.service.interface";
import { Mysteria } from "../models/mysteria.model";
import { User } from "../models/user.model";
import { Database } from "../sql/db";
import { GET_MYSTERIA, GET_MYSTERIES } from "../sql/queries";

export class MysteriaService{
    private db:Database;
    
    constructor(database:Database){
        this.db = database;
    }
    
    async getMysteries(): Promise<Mysteria[]> {
      const result = await this.db.query<Mysteria>(GET_MYSTERIES);
      return result.rows as Mysteria[];
    }

    async getMysteriaById(): Promise<Mysteria> {
        const result = await this.db.query<Mysteria>(GET_MYSTERIA, [1]);
        return result.rows[0] as Mysteria;
      }

  }