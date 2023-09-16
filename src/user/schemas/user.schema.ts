import * as mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    validate: isEmail,
    required: [true, 'EMAIL_IS_BLANK'],
  },
  password: {
    type: String,
    required: [true, 'PASSWORD_IS_BLANK'],
    select: false,
  },
});

UserSchema.pre('save', async function (next: any) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
