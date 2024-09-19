import mongoose, { Schema } from 'mongoose';
const VariantSchema = new Schema({
    type: { type: String, required: true },
    value: { type: String, required: true }
});
const InventorySchema = new Schema({
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, required: true }
});
const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    tags: [String],
    variants: [VariantSchema],
    inventory: InventorySchema
});
export default mongoose.model('Product', ProductSchema);
