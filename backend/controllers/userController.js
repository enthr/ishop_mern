import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { generateToken } from '../utils/generateToken.js';

// @desc   Auth User & Get Token
// @route  POST api/user/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email: email }).exec();

	if (user && (await user.matchPassword(password, user.password))) {
		return res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id)
		});
	} else {
		res.status(401);
		throw new Error('Invalid Email Or Password');
	}
});

// @desc   Register a new user
// @route  POST api/user/login
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('User Already Exists');
	}

	const user = await User.create({ name, email, password });

	if (user) {
		return res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id)
		});
	} else {
		res.status(400);
		throw new Error('Invalid User Data');
	}
});

// @desc   Get user profile
// @route  GET api/user/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		return res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin
		});
	} else {
		res.status(404);
		throw new Error('User Not Found');
	}
});

// @desc   Update user profile
// @route  PUT api/user/profile
// @access Private
export const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;

		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		return res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token: generateToken(updatedUser._id)
		});
	} else {
		res.status(404);
		throw new Error('User Not Found');
	}
});

// @desc   Get All Users
// @route  GET api/user
// @access Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});
	return res.json(users);
});

// @desc   Delete a User
// @route  DELETE api/users/:id
// @access Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		await user.remove();
		return res.json({ message: 'User Removed' });
	} else {
		res.status(404);
		throw new Error('User Not Found');
	}
});

// @desc   Get User By ID
// @route  GET api/user/:id
// @access Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select('-password');
	if (user) {
		return res.json(user);
	} else {
		res.status(404);
		throw new Error('User Not Found');
	}
});

// @desc   Update User
// @route  PUT api/user/:id
// @access Private
export const updateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.isAdmin = req.body.isAdmin;

		const updatedUser = await user.save();

		return res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('User Not Found');
	}
});