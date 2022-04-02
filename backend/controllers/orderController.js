import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

// @desc   Create New Order
// @route  POST api/orders
// @access Private
export const addOrderItems = asyncHandler(async (req, res) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice
	} = req.body;

	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error('No Order Items');
		return;
	} else {
		const order = new Order({
			user: req.user._id,
			orderItems,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice
		});

		const createdOrder = await order.save();

		return res.status(201).json(createdOrder);
	}
});

// @desc   Get Order By Id
// @route  GET api/orders/:id
// @access Private
export const getOrderById = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id).populate(
		'user',
		'name email'
	);

	if (order) {
		return res.json(order);
	} else {
		res.status(404);
		throw new Error('Order Not Found');
		return;
	}
});

// @desc   Update Order To Paid
// @route  PUT api/orders/:id/pay
// @access Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);

	if (order) {
		order.isPaid = true;
		order.paidAt = Date.now();
		order.paymentResult = {
			id: req.body.id,
			status: req.body.status,
			update_time: req.body.update_time,
			email_address: req.body.payer.email_address
		};

		const updatedOrder = await order.save();

		return res.json(updatedOrder);
	} else {
		res.status(404);
		throw new Error('Order Not Found');
	}
});

// @desc   Get Logged In User Orders
// @route  GET api/orders/myorders
// @access Private
export const getMyOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user._id });

	return res.json(orders);
});

// @desc   Get All Orders
// @route  GET api/orders
// @access Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({}).populate('user', 'id name');

	return res.json(orders);
});

// @desc   Update Order To Delivered
// @route  PUT api/orders/:id/deliver
// @access Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);

	if (order) {
		order.isDelivered = true;
		order.deliveredAt = Date.now();

		const updatedOrder = await order.save();

		return res.json(updatedOrder);
	} else {
		res.status(404);
		throw new Error('Order Not Found');
	}
});
