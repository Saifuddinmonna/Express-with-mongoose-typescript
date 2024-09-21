import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/ProductRoutes.js';
import orderRoutes from './routes/OrderRoutes.js';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
mongoose.connect('mongodb+srv://saifuddin:piY6nEcsdaSVKkv7@cluster0.wuiqqjn.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0', {})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
