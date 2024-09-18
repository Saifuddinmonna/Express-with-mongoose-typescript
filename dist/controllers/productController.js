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
exports.searchProducts = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const joi_1 = __importDefault(require("joi"));
// Define Joi schema for product validation
const productSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
    category: joi_1.default.string().required(),
    tags: joi_1.default.array().items(joi_1.default.string()).required(),
    variants: joi_1.default.array().items(joi_1.default.object({
        type: joi_1.default.string().required(),
        value: joi_1.default.string().required()
    })).required(),
    inventory: joi_1.default.object({
        quantity: joi_1.default.number().required(),
        inStock: joi_1.default.boolean().required()
    }).required()
});
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = productSchema.validate(req.body);
        if (error)
            return res.status(400).json({ success: false, message: error.details[0].message });
        const product = new Product_1.default(req.body);
        yield product.save();
        res.status(201).json({ success: true, message: 'Product created successfully!', data: product });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.createProduct = createProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find();
        res.status(200).json({ success: true, message: 'Products fetched successfully!', data: products });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.default.findById(req.params.productId);
        if (!product)
            return res.status(404).json({ success: false, message: 'Product not found' });
        res.status(200).json({ success: true, message: 'Product fetched successfully!', data: product });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.getProductById = getProductById;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = productSchema.validate(req.body);
        if (error)
            return res.status(400).json({ success: false, message: error.details[0].message });
        const product = yield Product_1.default.findByIdAndUpdate(req.params.productId, req.body, { new: true });
        if (!product)
            return res.status(404).json({ success: false, message: 'Product not found' });
        res.status(200).json({ success: true, message: 'Product updated successfully!', data: product });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.default.findByIdAndDelete(req.params.productId);
        if (!product)
            return res.status(404).json({ success: false, message: 'Product not found' });
        res.status(200).json({ success: true, message: 'Product deleted successfully!', data: null });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.deleteProduct = deleteProduct;
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = req.query.searchTerm;
        const products = yield Product_1.default.find({ name: new RegExp(searchTerm, 'i') });
        res.status(200).json({ success: true, message: `Products matching search term '${searchTerm}' fetched successfully!`, data: products });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.searchProducts = searchProducts;
