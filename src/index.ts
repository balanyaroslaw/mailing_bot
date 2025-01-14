import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { Bot } from './bot';

dotenv.config();

class Server {
  private app = express();
  private port: number | string;

  constructor() {
    this.port = process.env.PORT || 3000;
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.get('/', (req: Request, res: Response) => {
      res.send('for heroku only');
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

class TelegramBot {
  private botInstance: Bot;

  constructor(private token: string) {
    this.botInstance = Bot.getInstance(this.token);
  }

  public start(): void {
    this.botInstance.Start();
  }
}

class Application {
  private server: Server;
  private bot: TelegramBot;

  constructor() {
    const telegramToken = process.env.TELEGRAM_TOKEN!;
    if (!telegramToken) {
      throw new Error('TELEGRAM_TOKEN is not defined in environment variables.');
    }

    this.server = new Server();
    this.bot = new TelegramBot(telegramToken);
  }

  public start(): void {
    this.server.start();
    this.bot.start();
  }
}

const app = new Application();
app.start();
