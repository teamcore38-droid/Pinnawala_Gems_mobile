import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';

dotenv.config();

const seedProduct = async () => {
  try {
    await connectDB();

    const dummyProduct = {
      imageUrl: 'https://images.unsplash.com/photo-1549060278-7fa6c4b2ce96?auto=format&fit=crop&w=800&q=80',
      name: 'Brilliant Sapphire Ring',
      price: 249.99,
      carat: 2.5,
      description: 'A luxurious sapphire ring with brilliant cut and elegant setting, perfect for special occasions.',
      stockCount: 15,
    };

    const existing = await Product.findOne({ name: dummyProduct.name });
    if (existing) {
      console.log('Dummy product already exists:', existing._id);
    } else {
      const created = await Product.create(dummyProduct);
      console.log('Dummy product inserted:', created._id);
    }

    process.exit(0);
  } catch (error) {
    console.error('Failed to insert dummy product:', error);
    process.exit(1);
  }
};

seedProduct();
