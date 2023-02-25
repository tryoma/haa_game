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
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineEndpoint = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const line = __importStar(require("@line/bot-sdk"));
const config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN || '',
    channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};
const client = new line.Client(config);
const lineEndpoint = (req, res, next) => {
    const event = req.body.events[0];
    if (event.type === 'message' && event.message.type === 'text') {
        if (event.message.text === '新規') {
            // 新規お題作成
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
        text: `${msg}`
    };
};
function isUniqId(test) {
    const regex = /\d{1,2}[-]\d{10}/g;
    return !!test.match(regex);
}
