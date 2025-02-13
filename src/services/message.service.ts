import { IDailyMessage } from "../interfaces/dailymessage.interface";
import { Database } from "../sql/db";
import { Queries } from "../sql/queries";

export class MessageService{
    private db:Database;
    
    constructor(database:Database){
        this.db = database;
    }
    
    async getDailyMessage(): Promise<string | null> {
      const result = await this.db.query<IDailyMessage>(Queries.GET_DAILY_MESSAGE);
      const message = result.rows[0];
      if(message?.text){
        await this.db.query(Queries.UPDATE_DAILY_MESSAGE, [message?.message_id]);

        return message.text
      }
      return null;
    }

    async resetDailyMessage(): Promise<void> {
        await this.db.query(Queries.RESET_DAILY_MESSAGES);
    }

  }