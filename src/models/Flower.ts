import mongoose from 'mongoose';

const RecipeItemSchema = new mongoose.Schema({
  material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
  quantity: { type: Number, required: true },
});

const FlowerSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  name: { type: String, required: true },
  description: String,
  images: [String],
  mainImage: String,
  tags: [String],
  isActive: { type: Boolean, default: true },
  baseCost: { type: Number, default: 0 },
  salePrice: { type: Number, required: true },
  recipe: [RecipeItemSchema],
}, { timestamps: true });

export default mongoose.models.Flower || mongoose.model('Flower', FlowerSchema);
