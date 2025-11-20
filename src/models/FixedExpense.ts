import mongoose from 'mongoose';

const FixedExpenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true,
  },
  startDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.FixedExpense || mongoose.model('FixedExpense', FixedExpenseSchema);
