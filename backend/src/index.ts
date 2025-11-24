import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import marketRouter from './routes/market.js';
import portfolioRouter from './routes/portfolio.js';
import ordersRouter from './routes/orders.js';

dotenv.config({
  path: './.env',
});

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/market', marketRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/orders', ordersRouter);

const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/paper_trading_demo';

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      dbName: 'paper_trading_platform',
    });
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Backend API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
