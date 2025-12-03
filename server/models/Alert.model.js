import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symbol: { type: String, required: true },
    condition: { type: String, enum: ["above", "below"], required: true },
    targetPrice: { type: Number, required: true },
    triggered: { type: Boolean, default: false },
    triggerPrice: { type: Number },
    triggeredAt: { type: Date }
}, { timestamps: true });

export default mongoose.model("Alert", AlertSchema);
