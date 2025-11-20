import mongoose from 'mongoose';

const MaterialLotSchema = new mongoose.Schema({
  material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
  quantityImport: { type: Number, required: true },
  quantityRemain: { type: Number, required: true },
  importPrice: { type: Number, required: true },
  importDate: { type: Date, default: Date.now },
  expireDate: { type: Date, required: true },
  supplier: String,
  invoiceNumber: String,
  note: String,
}, { timestamps: true });

MaterialLotSchema.index({ material: 1, expireDate: 1 });

export default mongoose.models.MaterialLot || mongoose.model('MaterialLot', MaterialLotSchema);
