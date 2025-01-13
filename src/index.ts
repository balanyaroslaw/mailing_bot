import { Bot } from "./bot";
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('port');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const telegramToken = process.env.TELEGRAM_TOKEN!;

const botInstance = Bot.getInstance(telegramToken);
botInstance.Start(); 