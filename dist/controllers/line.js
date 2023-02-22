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
    client.replyMessage(event.replyToken, {
        type: 'template',
        altText: 'test',
        template: {
            "type": "confirm",
            "text": `今日の晩ご飯はでどう？`,
            "actions": [
                {
                    "type": "message",
                    "label": "NO",
                    "text": `今日の晩ご飯はで決まり！NO`
                },
                {
                    "type": "message",
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
exports.lineEndpoint = lineEndpoint;
