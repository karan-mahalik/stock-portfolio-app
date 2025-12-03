import cron from 'node-cron'
import Alert from '../models/Alert.model.js'
import { fetchStockPrice } from '../services/stockServices.js';

cron.schedule("* * * * *", async () => {
    console.log("Checking alerts...");
    try {
        const alerts = await Alert.find({ triggered: false })

        for (const alert of alerts) {
            const data = await fetchStockPrice(alert.symbol)

            const stock = data.quoteResponse?.result?.[0]
            if (!stock) {
                continue
            }

            const price = stock.regularMarketPrice

            let shouldTrigger = false

            if (alert.condition === "above" && price >= alert.target) {
                shouldTrigger = true;
            }

            if (alert.condition === "below" && price <= alert.target) {
                shouldTrigger = true;
            }

            if (shouldTrigger) {
                alert.triggered = true;
                alert.triggerPrice = price;
                alert.triggeredAt = new Date();
                await alert.save();

                console.log(`🔔 ALERT TRIGGERED: ${alert.symbol} is now ${price}`);
            }
        }
    } catch (error) {
        console.log("Cron job error:", error.message);
    }
})