import * as dotenv from 'dotenv';
dotenv.config();
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
    type: 'template',
    altText: 'test',
    template:{
      "type": "confirm",
      "text": `今日の晩ご飯はでどう？`,
      "actions": [
        {
          "type": "message", //"NO"が押されたらpostbackアクション
          "label": "NO",
          "text": `今日の晩ご飯はで決まり！NO`
        },
        {
          "type": "message", //"YES"が押されたらmessageアクション
          "label": "YES",
          "text": `今日の晩ご飯はで決まり！`
        }
      ]
    }
  });
  console.log(req.body.events);
  console.log('test');

  res.status(201);
};


