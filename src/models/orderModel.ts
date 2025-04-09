import mongoose, { Document, Schema } from 'mongoose';

export interface Order extends Document {
  userId: string;
  productIds: string[];
  status: string;
  totalAmount: number;
}

const orderSchema = new Schema<Order>({
  userId: { type: String, required: true },
  productIds: { type: [String], required: true },
  status: { type: String, required: true },
  totalAmount: { type: Number, required: true },
});

const Order = mongoose.model<Order>('Order', orderSchema);
export default Order;
