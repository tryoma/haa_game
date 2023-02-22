"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todos_1 = __importDefault(require("./routes/todos"));
const line_1 = __importDefault(require("./routes/line"));
const body_parser_1 = require("body-parser");
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
// 検証用
app.post('/webhook', (req, res, next) => {
    res.sendStatus(200);
    next();
});
app.use('/webhook', line_1.default);
app.use('/todos', todos_1.default);
app.use((err, req, res, nest) => {
    res.status(500).json({ message: err.message });
});
app.listen(3000);
