import WatchList from '../models/Watchlist.model.js'
export const addToWatchlist = async (req, res) => {
    try {
        const { symbol } = req.body

        if (!symbol) {
            return res.status(400).json({ message: "Symbol is required" })
        }

        const exists = await WatchList.findOne({ userId: req.userId, symbol })
        if (exists) {
            return res.status(400).json({ message: "Already in watchlist" })
        }

        const item = await WatchList.create({
            userId: req.userId,
            symbol: symbol.toUpperCase()
        })
        return res.status(200).json({ message: "Added to watchlit", item })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

export const getWatchlist = async (req, res) => {
    try {
        const items = await WatchList.find({ userId: req.userId })
        return res.status(200).json(items)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

export const removeFromwatchlist = async (req, res) => {
    try {
        const { symbol } = req.params

        const removed = await WatchList.findOneAndDelete({
            userId: req.userId,
            symbol: symbol.toUpperCase()
        })
        if (!removed) {
            return res.status(404).json({ message: "Not found" })
        }
        return res.status(200).json({ message: "Removed from watchlist" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}