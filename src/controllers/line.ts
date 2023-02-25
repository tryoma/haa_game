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
  if (event.type === 'message' && event.message.type === 'text') {
    if (event.message.text === '新規') {
      // 新規お題作成
    } else if (event.message.text === 'お題IDあり') {
      client.replyMessage(event.replyToken, textTemplate('お題IDを貼り付けて下さい。'));
    } else if (isUniqId(event.message.text)) {
      // お題検索
    } else {
      client.replyMessage(event.replyToken, confirmTemplate());
    }
  }
  // client.replyMessage(event.replyToken, {
  //   type: 'template',
  //   altText: 'test',
  //   template: {
  //     type: 'confirm',
  //     text: '新規ですか？それとも、お題IDをお持ちですか？',
  //     actions: [
  //       {
  //         type: 'message', //"NO"が押されたらpostbackアクション
  //         label: '新規',
  //         text: '新規',
  //       },
  //       {
  //         type: 'message', //"YES"が押されたらmessageアクション
  //         label: 'お題IDあり',
  //         text: 'お題IDあり',
  //       },
  //     ],
  //   },
  // });
  res.status(201);
};

const confirmTemplate = () => {
  return {
    type: 'template',
    altText: 'test',
    template: {
      type: 'confirm',
      text: `新規ですか？それとも、\nお題IDをお持ちですか？`,
      actions: [
        {
          type: 'message', 
          label: '新規',
          text: '新規',
        },
        {
          type: 'message',
          label: 'お題IDあり',
          text: 'お題IDあり',
        },
      ],
    },
  } as line.Message;
};

const textTemplate = (msg: string) => {
  return {
    type: 'text',
    text: `${msg}`
  } as line.Message;
};

function isUniqId(test: string): boolean {
  const regex = /\d{1,2}[-]\d{10}/g;
  return !!test.match(regex);
}
