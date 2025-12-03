import Alert from "../models/Alert.model.js";


export const addAlert = async (req, res) => {
    try {
        const userId = req.userId;
        const { symbol, condition, targetPrice } = req.body;

        if (!symbol || !condition || !targetPrice) {
            return res.status(400).json({ message: "All fields required" });
        }

        const alert = await Alert.create({
            userId,
            symbol: symbol.toUpperCase(),
            condition,
            targetPrice
        });

        return res.status(200).json({ message: "Alert created", alert });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getAlerts = async (req, res) => {
    try {
        const userId = req.userId;
        const alerts = await Alert.find({ userId });

        return res.status(200).json(alerts);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const deleteAlert = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const alert = await Alert.findOneAndDelete({ _id: id, userId });

        if (!alert) {
            return res.status(404).json({ message: "Alert not found" });
        }

        return res.status(200).json({ message: "Alert deleted" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};
