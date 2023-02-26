import * as dotenv from 'dotenv';
dotenv.config();
import { RequestHandler } from 'express';
import * as line from '@line/bot-sdk';

import fs from 'fs';
import { parse } from 'csv-parse/sync';
const file = fs.readFileSync('src/haa.csv').toString();
const records = parse(file, { columns: false });
console.log(records[0]);
const moment = require('moment');
const currentTime = moment();

import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

mongoose
  .connect(process.env.MONGO_DB || '')
  .then(() => {
    console.log('success!');
  })
  .catch((err) => {
    console.log('fail!');
  });

const Schema = mongoose.Schema;
const DataSchema = new Schema({
  titleId: Number,
  uniqId: String,
  usedNumber: Array,
  startedOn: Date,
});

const DataModel = mongoose.model('Data', DataSchema);

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

const client = new line.Client(config);
export const lineEndpoint: RequestHandler = (req, res, next) => {
  const event = req.body.events[0];
  if (event.type === 'message' && event.message.type === 'text') {
    if (event.message.text === '新規') {
      console.log(records[0]);
      const titleId = records[Math.floor(Math.random() * records.length)][0];
      const uniqId =
        Math.floor(Math.random() * 101) +
        '-' +
        currentTime.format('YYYYMMDDHH');
      const newNum = Math.floor(Math.random() * 9);
      const saveData = {
        titleId: Number(titleId),
        uniqId: uniqId,
        usedNumber: [newNum],
        startedOn: new Date(),
      };
      DataModel.create(saveData, (err, data) => {
        if (err) {
          console.log(err);
          // messages = [
          //   {
          //     type: 'text',
          //     text: 'エラーがおきました。',
          //   },
          // ]
          // request(replyToken, messages)
        } else {
          console.log(data);
        }
      });
    } else if (event.message.text === 'お題IDあり') {
      client.replyMessage(
        event.replyToken,
        textTemplate('お題IDを貼り付けて下さい。')
      );
    } else if (isUniqId(event.message.text)) {
      // お題検索
    } else {
      client.replyMessage(event.replyToken, confirmTemplate());
    }
  }
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
    text: `${msg}`,
  } as line.Message;
};

function isUniqId(test: string): boolean {
  const regex = /\d{1,2}[-]\d{10}/g;
  return !!test.match(regex);
}
