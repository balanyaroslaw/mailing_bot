import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";


export class UserController{
    constructor(private userService:UserService){}

    async addNewUser(user:User):Promise<User>{
        const newUser = await this.userService.addNewUser(user);
        return newUser;
    } 

    async deleteUser(user:User):Promise<void>{
        await this.userService.deleteUser(user);
    } 

    async getUser(tg_id:number):Promise<User | null>{
       const user =  await this.userService.getUserByTgId(tg_id)
       return user
    }
}