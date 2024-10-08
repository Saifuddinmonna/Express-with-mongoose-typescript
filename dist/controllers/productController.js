import Product from '../models/Product.js';
import Joi from '@hapi/joi';
// Define Joi schema for product validation
const productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
    variants: Joi.array().items(Joi.object({
        type: Joi.string().required(),
        value: Joi.string().required()
    })).required(),
    inventory: Joi.object({
        quantity: Joi.number().required(),
        inStock: Joi.boolean().required()
    }).required()
});
export const createProduct = async (req, res) => {
    try {
        const { error } = productSchema.validate(req.body);
        if (error)
            return res.status(400).json({ success: false, message: error.details[0].message });
        const { name, description, price, category, tags, variants, inventory } = req.body;
        // Checking if the product already exists based on a unique field (like name)
        let product = await Product.findOne({ name });
        console.log('test :', product);
        if (product) {
            // If product exists, update the quantity and inStock status
            product.inventory.quantity += inventory.quantity;
            product.inventory.inStock = product.inventory.quantity > 0;
            // Save the updated product
            const updatedProduct = await product.save();
            return res.status(200).json({
                success: true,
                message: 'Product quantity updated successfully!',
                data: updatedProduct
            });
        }
        else {
            // If product does not exist, create a new one
            product = new Product({
                name,
                description,
                price,
                category,
                tags,
                variants,
                inventory: {
                    quantity: inventory.quantity,
                    inStock: inventory.quantity > 0 ? true : false
                }
            });
            // Save the new product to the database
            const newProduct = new Product(req.body);
            await product.save();
            res.status(201).json({ success: true, message: 'Product created successfully!', data: newProduct });
            console.log(newProduct);
            res.status(201).json({
                success: true,
                message: 'Product created successfully!',
                data: newProduct
            });
            ;
        }
    }
    catch (err) {
        console.error(err); // Log the error
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, message: 'Products fetched successfully!', data: products });
    }
    catch (err) {
        console.error(err); // Log the error
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product)
            return res.status(404).json({ success: false, message: 'Product not found' });
        res.status(200).json({ success: true, message: 'Product fetched successfully!', data: product });
    }
    catch (err) {
        console.error(err); // Log the error
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const { error } = productSchema.validate(req.body);
        if (error)
            return res.status(400).json({ success: false, message: error.details[0].message });
        const product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
        if (!product)
            return res.status(404).json({ success: false, message: 'Product not found' });
        res.status(200).json({ success: true, message: 'Product updated successfully!', data: product });
    }
    catch (err) {
        console.error(err); // Log the error
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.productId);
        if (!product)
            return res.status(404).json({ success: false, message: 'Product not found' });
        res.status(200).json({ success: true, message: 'Product deleted successfully!', data: null });
    }
    catch (err) {
        console.error(err); // Log the error
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
export const searchProducts = async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm;
        const products = await Product.find({ name: new RegExp(searchTerm, 'i') });
        res.status(200).json({ success: true, message: `Products matching search term '${searchTerm}' fetched successfully!`, data: products });
    }
    catch (err) {
        console.error(err); // Log the error
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
