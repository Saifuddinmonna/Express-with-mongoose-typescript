import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/ProductRoutes';
import orderRoutes from './routes/OrderRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

mongoose.connect('mongodb://localhost:27017/ecommerce', {
 
 
})
.then(() => console.log('MongoDB connected'))
.catch((err: Error) => console.log(err));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
