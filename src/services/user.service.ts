import { IUser } from "../interfaces/user.interface";
import { IUserService } from "../interfaces/user.service.interface";
import { Mysteria } from "../models/mysteria.model";
import { User } from "../models/user.model";
import { Database } from "../sql/db";
import { DELETE_USER, GET_ALL_USERS, GET_USER_BY_TG, INSERT_USER, UPDATE_MYSTERIES, UPDATE_USER } from "../sql/queries";

export class UserService implements IUserService {
    private db:Database;
    
    constructor(database:Database){
        this.db = database;
    }
    
    async addNewUser(data: User): Promise<User> {
        const result = await this.db.query<User>(INSERT_USER, [data.name, data.email, data.tg_id, data.mysteria.mysteries_id]);
        return result.rows[0] as User;
    }  

    async deleteUser(data: User): Promise<void> {
        await this.db.query<User>(DELETE_USER, [data.tg_id]);
    } 

    async updateUser(data:User):Promise<User>{
        const result = await this.db.query<User>(UPDATE_USER, [data.name, data.email, data.mysteria.mysteries_id, data.tg_id]);
        return result.rows[0] as User;
    }

    async changeMysteria():Promise<void> {
        await this.db.query<User>(UPDATE_MYSTERIES);
    } 

    async getUsers(): Promise<User[]> {
      const result = await this.db.query<User>(GET_ALL_USERS);
      return result.rows as User[];
    }

    async getUserByTgId(tg_id:number):Promise<User | null>{
        const result = await this.db.query<User>(GET_USER_BY_TG, [tg_id]);
         return result.rows[0] as User;
    }
  }