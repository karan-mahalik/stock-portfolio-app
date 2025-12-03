import { 
    fetchStockPrice,
    searchStocksAPI,
    fetchHistoricalData
} from "../services/stockServices.js";

// GET LIVE PRICE
export const getPrice = async (req, res) => {
    try {
        const { symbol } = req.params;

        const priceData = await fetchStockPrice(symbol);

        if (!priceData) {
            return res.status(404).json({ message: "Price not found" });
        }

        res.json(priceData);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// SEARCH
export const searchStocks = async (req, res) => {
    try {
        const { q } = req.query;
        const results = await searchStocksAPI(q);

        const filtered = results.map(s => ({
            symbol: s.symbol,
            name: s.shortname || s.longname,
            exchange: s.exchange
        }));

        res.json(filtered);
    } catch (error) {
        res.status(500).json({ message: "Search failed" });
    }
};


// CHART HISTORY
export const getHistory = async (req, res) => {
    try {
        const { symbol } = req.params;
        const result = await fetchHistoricalData(symbol);

        const timestamps = result.timestamp;
        const closes = result.indicators.quote[0].close;

        const chartData = timestamps.map((t, i) => ({
            date: new Date(t * 1000),
            close: closes[i]
        }));

        res.json(chartData);
    } catch (error) {
        res.status(500).json({ message: "History fetch failed" });
    }
};
