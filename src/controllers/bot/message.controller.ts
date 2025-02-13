import { MessageService } from "../../services/message.service";

export class MessageController {
    constructor(private messageService: MessageService) {}

    async getDailyMessage(): Promise<string | null> {
        return await this.messageService.getDailyMessage();
    }

    async resetDailyMessage(): Promise<void> {
        await this.messageService.resetDailyMessage();
    }
}