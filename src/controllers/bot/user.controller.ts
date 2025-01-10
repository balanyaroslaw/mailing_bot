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
       const user = await this.userService.getUserByTgId(tg_id)
       return user as User
    }

    async updateUser(user:User):Promise<User>{
        const updatedUser = await this.userService.updateUser(user);
        return updatedUser;
    }

    async getAllUsers():Promise<User[]>{
        const users = await this.userService.getUsers();
        return users as User[]
    }
}