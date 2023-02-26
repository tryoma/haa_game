"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineEndpoint = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const line = __importStar(require("@line/bot-sdk"));
const fs_1 = __importDefault(require("fs"));
const sync_1 = require("csv-parse/sync");
const file = fs_1.default.readFileSync('src/haa.csv').toString();
const records = (0, sync_1.parse)(file, { columns: false });
console.log(records[0]);
const moment = require('moment');
const currentTime = moment();
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('strictQuery', true);
mongoose_1.default
    .connect(process.env.MONGO_DB || '')
    .then(() => {
    console.log('success!');
})
    .catch((err) => {
    console.log('fail!');
});
const Schema = mongoose_1.default.Schema;
const DataSchema = new Schema({
    titleId: Number,
    uniqId: String,
    usedNumber: Array,
    startedOn: Date,
});
const DataModel = mongoose_1.default.model('Data', DataSchema);
const config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN || '',
    channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};
const client = new line.Client(config);
const lineEndpoint = (req, res, next) => {
    const event = req.body.events[0];
    if (event.type === 'message' && event.message.type === 'text') {
        if (event.message.text === '新規') {
            console.log(records[0]);
            const titleId = records[Math.floor(Math.random() * records.length)][0];
            const uniqId = Math.floor(Math.random() * 101) +
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
                }
                else {
                    console.log(data);
                }
            });
        }
        else if (event.message.text === 'お題IDあり') {
            client.replyMessage(event.replyToken, textTemplate('お題IDを貼り付けて下さい。'));
        }
        else if (isUniqId(event.message.text)) {
            // お題検索
        }
        else {
            client.replyMessage(event.replyToken, confirmTemplate());
        }
    }
    res.status(201);
};
exports.lineEndpoint = lineEndpoint;
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
    };
};
const textTemplate = (msg) => {
    return {
        type: 'text',
        text: `${msg}`,
    };
};
function isUniqId(test) {
    const regex = /\d{1,2}[-]\d{10}/g;
    return !!test.match(regex);
}
