import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Joi from '@hapi/joi';

// Define Joi schema for order validation
const orderSchema = Joi.object({
  email: Joi.string().email().required(),
  productId: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required()
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { error } = orderSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { email, productId, price, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.inventory.quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient quantity available in inventory' });
    }

    // Create the order
    const order = new Order({ email, productId, price, quantity });
    await order.save();

    // Update inventory
    product.inventory.quantity -= quantity;
    if (product.inventory.quantity === 0) {
      product.inventory.inStock = false;
    }
    await product.save();

    res.status(201).json({ success: true, message: 'Order created successfully!', data: order });
  } catch (err: unknown)  {console.log(err)
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ success: true, message: 'Orders fetched successfully!', data: orders });
  } catch (err: unknown)  {console.log(err)
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getOrdersByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    const orders = await Order.find({ email });
    res.status(200).json({ success: true, message: 'Orders fetched successfully for user email!', data: orders });
  } catch (err: unknown)  {

    console.log(err)
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
