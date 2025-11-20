import mongoose from 'mongoose';

const InventoryMovementSchema = new mongoose.Schema({
  type: { type: String, enum: ['in', 'out', 'adjust'], required: true },
  material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
  lot: { type: mongoose.Schema.Types.ObjectId, ref: 'MaterialLot' },
  quantity: { type: Number, required: true },
  reason: String,
  reference: { type: mongoose.Schema.Types.ObjectId, refPath: 'referenceModel' },
  referenceModel: { type: String, enum: ['Order', 'MaterialLot'] },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.InventoryMovement || mongoose.model('InventoryMovement', InventoryMovementSchema);
