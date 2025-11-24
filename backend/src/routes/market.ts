import { Router } from 'express';
import {
  listSymbols,
  getSymbol,
  getQuote,
} from '../controllers/marketController.js';

const router = Router();

router.get('/symbols', listSymbols);
router.get('/symbols/:symbol', getSymbol);
router.get('/symbols/:symbol/quote', getQuote);

export default router;
