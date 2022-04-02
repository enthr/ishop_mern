import Mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false
		}
	},
	{
		timestamps: true
	}
);

userSchema.methods.matchPassword = async function (enteredPassword, password) {
	return await bcrypt.compareSync(enteredPassword, password);
};

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = Mongoose.model('User', userSchema);

export default User;
