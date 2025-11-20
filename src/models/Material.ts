import mongoose from 'mongoose';

const MaterialSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  unit: { type: String, required: true },
  description: String,
  image: String,
  isActive: { type: Boolean, default: true },
  minStockLevel: { type: Number, default: 10 },
}, { timestamps: true });

export default mongoose.models.Material || mongoose.model('Material', MaterialSchema);
