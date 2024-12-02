const ProductModel = require('../models/productModel');
const { validateProduct } = require('../validation/product');
const Comment = require('../models/commentModel');
const Rating = require('../models/ratingModel');

// Example route to create a new product
const createProduct = async (req, res) => {
  const { error } = validateProduct(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.details
    });
  }

  try {
    const newProduct = new ProductModel(req.body);
    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    res.status(500).json({ message: 'Error saving product', error: err.message });
  }
};

// Route to get all products
const getProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await ProductModel.find();

    // Return the products in the response
    res.status(200).json({ 
      message: 'Products fetched successfully', 
      products 
    });
  } catch (err) {
    // Handle errors and send a response with status 500
    res.status(500).json({ 
      message: 'Error fetching products', 
      error: err.message 
    });
  }
};

// get product by id
const getProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ 
      message: 'Product details fetched successfully', 
      product 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching product details', 
      error: err.message 
    });
  }
};

// Add a review (rating)
const addReview = async (req, res) => {
  const { productId, userId, rating } = req.body;

  if (!productId || !userId || !rating) {
      return res.status(400).json({ message: "All fields are required (productId, userId, rating)" });
  }

  try {
      const product = await ProductModel.findById(productId);

      if (!product) {
          return res.status(404).json({ message: "Product not found" });
      }

      product.ratings.push({ userId, rating });
      await product.save();

      res.status(200).json({ message: "Rating added successfully", ratings: product.ratings });
  } catch (err) {
      res.status(500).json({ message: "Error adding rating", error: err.message });
  }
};


// Add a comment
const addComment = async (req, res) => {
  const { productId, userId, text } = req.body;

  if (!productId || !userId || !text) {
      return res.status(400).json({ message: "All fields are required (productId, userId, text)" });
  }

  try {
      const product = await ProductModel.findById(productId);

      if (!product) {
          return res.status(404).json({ message: "Product not found" });
      }

      product.comments.push({ userId, text });
      await product.save();

      res.status(200).json({ message: "Comment added successfully", comments: product.comments });
  } catch (err) {
      res.status(500).json({ message: "Error adding comment", error: err.message });
  }
};

// Lấy sản phẩm liên quan

const getRelatedProducts = async (req, res) => {
  const { productId } = req.params;

  try {
      // Tìm sản phẩm hiện tại
      const product = await ProductModel.findById(productId);
      if (!product) {
          return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      }

      // Lấy danh sách sản phẩm liên quan dựa trên cùng danh mục
      const relatedProducts = await ProductModel.find({
          category: product.category, // Lọc theo danh mục
          _id: { $ne: productId },    // Loại bỏ sản phẩm hiện tại
      }).limit(10); // Giới hạn 5 sản phẩm liên quan

      res.status(200).json(relatedProducts);
  } catch (error) {
      console.error('Lỗi khi lấy sản phẩm liên quan:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ' });
  }
};


module.exports = {createProduct, getProducts, getProductById, addReview, addComment, getRelatedProducts };