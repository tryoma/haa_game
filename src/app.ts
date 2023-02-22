import express, { NextFunction, Request, Response } from 'express';
import todoRoutes from './routes/todos';
import lineRoutes from './routes/line';
import { json } from 'body-parser';

const app = express();

app.use(json());

// 検証用
app.post('/webhook', (req, res, next) => {
  res.sendStatus(200);
  next();
});

app.use('/webhook', lineRoutes);
app.use('/todos', todoRoutes);

app.use((err: Error, req: Request, res: Response, nest: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000);
