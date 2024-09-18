import mongoose, { Document, Schema } from 'mongoose';

interface IVariant {
  type: string;
  value: string;
}

interface IInventory {
  quantity: number;
  inStock: boolean;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  variants: IVariant[];
  inventory: IInventory;
}

const VariantSchema: Schema = new Schema({
  type: { type: String, required: true },
  value: { type: String, required: true }
});

const InventorySchema: Schema = new Schema({
  quantity: { type: Number, required: true },
  inStock: { type: Boolean, required: true }
});

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [String],
  variants: [VariantSchema],
  inventory: InventorySchema
});

export default mongoose.model<IProduct>('Product', ProductSchema);
