import Holding from '../models/Holding.model.js'

export const addHolding = async (req, res) => {
    try {
        const { stock, qty, avg } = req.body
        if (!stock || !qty || !avg) {
            return res.status(400).json({ message: "All fields required" })
        }

        const newHolding = await Holding.create({
            userId: req.userId,
            stock,
            qty,
            avg
        })
        return res.status(200).json({ message: "Holding added", holding: newHolding })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" })
    }
}

export const getHoldings = async (req, res) => {
    try {
        const list = await Holding.find({ userId: req.userId })
        return res.status(200).json(list)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

export const editHolding = async (req, res) => {
    try {
        const { id } = req.params
        const { qty, avg } = req.body

        const holding = await Holding.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { qty, avg },
            { new: true }
        )
        if (!holding) {
            return res.status(404).json({ message: "Holding not found" });
        }
        return res.status(200).json({ message: "Holding updated", holding })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

export const deleteHolding = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Holding.findOneAndDelete({
            _id: id,
            userId: req.userId
        })
        if (!deleted) {
            return res.status(404).json({ message: "Holding not found" });
        }
        return res.status(200).json({ message: "Holding Deleted" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" })
    }
}

