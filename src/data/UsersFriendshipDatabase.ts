import { BaseDatabase } from "./BaseDatabase";

export class UsersFriendshipDatabase extends BaseDatabase {
    private static TABLE_NAME = 'labook_friends';
  
    public async befriendUser(userId:string, friendId: string): Promise<void> {
      await this.getConnection()
        .insert([
            {
                user_id: userId,
                friend_id: friendId,
            },{
                user_id: friendId,
                friend_id: userId,
        }]).into(UsersFriendshipDatabase.TABLE_NAME)
    }
  
    public async unfriendUser(userId:string, friendId: string): Promise<void> {
      await this.getConnection()
        .del()
        .from(UsersFriendshipDatabase.TABLE_NAME)
        .where({
            user_id: userId,
            friend_id: friendId,
        })
        .or.where({
            user_id: friendId,
            friend_id: userId,
        });
    }
  
    public async checkFriendship(userId:string, friendId: string): Promise<void> {
      await this.getConnection()
        .select()
        .from(UsersFriendshipDatabase.TABLE_NAME)
        .where({
            user_id: userId,
            friend_id: friendId,
        })
        .or.where({
            user_id: friendId,
            friend_id: userId,
        });
    }
    
}