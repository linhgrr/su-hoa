import mongoose from 'mongoose';

const ExpenseTransactionSchema = new mongoose.Schema({
  fixedExpense: { type: mongoose.Schema.Types.ObjectId, ref: 'FixedExpense', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  note: String,
}, { timestamps: true });

export default mongoose.models.ExpenseTransaction || mongoose.model('ExpenseTransaction', ExpenseTransactionSchema);
