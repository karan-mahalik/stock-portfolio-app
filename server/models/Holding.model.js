import mongoose from 'mongoose'

const holdingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    stock: {
        type: String,
        required: true
    },
    qty: { type: Number, required: true },
    avg: { type: Number, required: true }
}, { timestamps: true })

export default mongoose.model("Holding", holdingSchema)