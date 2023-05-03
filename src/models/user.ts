import mongoose from 'mongoose';
import validator from 'validator';
import { IUser } from '../types';

//  схемы пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validatorFun(v: string) {
        return validator.isEmail(v);
      },
      message: 'Вам должно быть больше 18 лет!',
    }
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>('user', userSchema);
