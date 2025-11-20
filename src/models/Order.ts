import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  flower: { type: mongoose.Schema.Types.ObjectId, ref: 'Flower', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
});

const OrderSchema = new mongoose.Schema({
  code: { type: String, unique: true, sparse: true }, // sparse allows multiple null values
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  source: { type: String, enum: ['guest', 'admin'], default: 'guest' },
  deliveryDate: Date,
  note: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivering', 'done', 'cancelled'],
    default: 'pending',
  },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  payment: {
    method: { type: String, enum: ['cash', 'transfer', 'wallet'], default: 'cash' },
    status: { type: String, enum: ['unpaid', 'partial', 'paid'], default: 'unpaid' },
    paidAmount: { type: Number, default: 0 },
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
}, { timestamps: true });

// Auto-generate order code before saving
OrderSchema.pre('save', async function(next) {
  if (!this.code && this.isNew) {
    // Generate code like: ORD20251120001
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    
    // Find the last order of today to increment
    const lastOrder = await mongoose.models.Order.findOne({
      code: new RegExp(`^ORD${dateStr}`)
    }).sort({ code: -1 });
    
    let sequence = 1;
    if (lastOrder && lastOrder.code) {
      const lastSequence = parseInt(lastOrder.code.slice(-3));
      sequence = lastSequence + 1;
    }
    
    this.code = `ORD${dateStr}${sequence.toString().padStart(3, '0')}`;
  }
  next();
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
