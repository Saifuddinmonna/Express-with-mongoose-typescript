"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersByEmail = exports.getOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const joi_1 = __importDefault(require("@hapi/joi"));
// Define Joi schema for order validation
const orderSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    productId: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
    quantity: joi_1.default.number().required()
});
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = orderSchema.validate(req.body);
        if (error)
            return res.status(400).json({ success: false, message: error.details[0].message });
        const { email, productId, price, quantity } = req.body;
        const product = yield Product.findById(productId);
        if (!product)
            return res.status(404).json({ success: false, message: 'Product not found' });
        if (product.inventory.quantity < quantity) {
            return res.status(400).json({ success: false, message: 'Insufficient quantity available in inventory' });
        }
        // Create the order
        const order = new Order_1.default({ email, productId, price, quantity });
        yield order.save();
        // Update inventory
        product.inventory.quantity -= quantity;
        if (product.inventory.quantity === 0) {
            product.inventory.inStock = false;
        }
        yield product.save();
        res.status(201).json({ success: true, message: 'Order created successfully!', data: order });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.createOrder = createOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find();
        res.status(200).json({ success: true, message: 'Orders fetched successfully!', data: orders });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.getOrders = getOrders;
const getOrdersByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        const orders = yield Order_1.default.find({ email });
        res.status(200).json({ success: true, message: 'Orders fetched successfully for user email!', data: orders });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.getOrdersByEmail = getOrdersByEmail;
