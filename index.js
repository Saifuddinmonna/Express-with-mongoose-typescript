"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use('/api/products', productRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
mongoose_1.default.connect('mongodb://localhost:27017/ecommerce', {})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
