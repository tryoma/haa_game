// import * as dotenv from 'dotenv';
// dotenv.config();
import { RequestHandler } from 'express';
import * as line from '@line/bot-sdk';

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

const client = new line.Client(config);
export const lineEndpoint: RequestHandler = (req, res, next) => {
  const event = req.body.events[0];
  client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text,
  });
  console.log(req.body.events);
  console.log('test');

  res.status(201);
};
