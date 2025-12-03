import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const fetchStockPrice = async (symbol) => {
  try {
    const data = await yahooFinance.quote(symbol);

    if (!data || !data.regularMarketPrice) return null;

    return {
      price: data.regularMarketPrice,
      changePercent: data.regularMarketChangePercent,
    };
  } catch (error) {
    console.error("PRICE ERROR:", error);
    return null;
  }
};

export const searchStocksAPI = async (query) => {
  try {
    const result = await yahooFinance.search(query);
    return result.quotes || [];
  } catch (error) {
    console.log("SEARCH ERROR:", error);
    return [];
  }
};

export const fetchHistoricalData = async (symbol, range = "1mo", interval = "1d") => {
  try {
    const result = await yahooFinance.chart(symbol, {
      interval,
      range,
    });
    return result;
  } catch (error) {
    console.log("HISTORY ERROR:", error);
    return null;
  }
};
