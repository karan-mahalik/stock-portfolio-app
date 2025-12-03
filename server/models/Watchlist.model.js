import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    symbol: { type: String, required: true }
}, { timestamps: true })

export default mongoose.model("Watchlist", watchlistSchema)