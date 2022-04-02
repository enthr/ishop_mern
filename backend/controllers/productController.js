import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc   Fetch All Products
// @route  GET api/products
// @access Public
export const getProducts = asyncHandler(async (req, res) => {
	const pageSize = 10;
	const page = Number(req.query.pageNumber) || 1;
	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'i'
				}
		  }
		: {};

	const count = await Product.countDocuments({ ...keyword });

	const products = await Product.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1));
	return res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc   Fetch Product By Id
// @route  GET api/products/:id
// @access Public
export const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		return res.json(product);
	} else {
		res.status(404);
		throw new Error('Product Not Found');
	}
});

// @desc   Delete a Product
// @route  DELETE api/products/:id
// @access Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product.user.equals(req.user._id)) {
		await product.remove();
		return res.json({ message: 'Product Removed' });
	} else if (!product.user.equals(req.user._id)) {
		res.status(401);
		throw new Error('You are Not Authorized To Delete This Product');
	} else {
		res.status(404);
		throw new Error('Product Not Found');
	}
});

// @desc   Create a Product
// @route  POST api/products
// @access Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
	const product = new Product({
		name: 'Sample Name',
		price: 0,
		user: req.user._id,
		image: '/images/sample.jpg',
		brand: 'Sample Brand',
		category: 'Sample Category',
		countInStock: 0,
		numReviews: 0,
		description: 'Sample Description'
	});

	const createdProduct = await product.save();
	return res.status(201).json(createdProduct);
});

// @desc   Update a Product
// @route  PUT api/products/:id
// @access Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
	const { name, price, image, brand, category, countInStock, description } =
		req.body;

	const product = await Product.findById(req.params.id);

	if (product && product.user.equals(req.user._id)) {
		product.name = name;
		product.price = price;
		product.image = image;
		product.brand = brand;
		product.category = category;
		product.countInStock = countInStock;
		product.description = description;

		const updatedProduct = await product.save();
		return res.status(201).json(updatedProduct);
	} else if (!(product && product.user.equals(req.user._id))) {
		res.status(401);
		throw new Error('You are Not Authorized To Edit This Product');
	} else {
		res.status(404);
		throw new Error('Product Not Found');
	}
});

// @desc   Create New Review
// @route  POST api/products/:id/review
// @access Private
export const createProductReview = asyncHandler(async (req, res) => {
	const { rating, comment } = req.body;

	const product = await Product.findById(req.params.id);

	if (product) {
		const alreadyReviewed = product.reviews.find(
			(r) => r.user.toString() === req.user._id.toString()
		);

		if (alreadyReviewed) {
			res.status(400);
			throw new Error('Product Already Reviewed');
		}

		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment: comment,
			user: req.user._id
		};

		product.reviews.push(review);

		product.numReviews = product.reviews.length;

		product.rating =
			product.reviews.reduce((acc, item) => item.rating + acc, 0) /
			product.reviews.length;

		await product.save();
		return res.status(201).json({ message: 'Review Added' });
	} else {
		res.status(404);
		throw new Error('Product Not Found');
	}
});

// @desc   Get Top Rated Products
// @route  GET api/products/top
// @access Public
export const getTopProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({}).sort({ rating: -1 }).limit(3);
	return res.json(products);
});
