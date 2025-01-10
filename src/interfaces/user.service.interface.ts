import { User } from "../models/user.model";
import { IUser } from "./user.interface";

export interface IUserService {
    addNewUser(data:User): Promise<User>,
    deleteUser(data:User): Promise<void>,
    changeMysteria():Promise<void>
}