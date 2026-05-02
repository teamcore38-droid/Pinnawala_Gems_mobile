import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  carat: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stockCount: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;