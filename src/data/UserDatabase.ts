import { User } from "../model/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    private static TABLE_NAME: string = 'labook_users';
  
    public async registerUser(id: string, name: string, email: string, password: string): Promise<void> {
      await this.getConnection()
        .insert({
          id,
          name,
          email,
          password
        }).into(UserDatabase.TABLE_NAME);
    }
  
    public async getUserByEmail(email: string): Promise<any> {
      const result = await this.getConnection()
        .select('*')
        .from(UserDatabase.TABLE_NAME)
        .where({ email});
      return result[0]
    }
  
    public async getUserById(id: string): Promise<User> {
      const result = await this.getConnection()
        .select('*')
        .from(UserDatabase.TABLE_NAME)
        .where({ id });
  
      return User.toUserModel(result[0]);
    }
  
    public async deleteUser(id: string): Promise<void> {
      await this.getConnection()
        .del()
        .from(UserDatabase.TABLE_NAME)
        .where({ id });
    }

}