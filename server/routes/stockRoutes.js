import express from "express";
import { getPrice, searchStocks, getHistory } from "../controllers/stockController.js";

const router = express.Router();

router.get("/price/:symbol", getPrice);
router.get("/search", searchStocks);
router.get("/history/:symbol", getHistory);

export default router;
