import mongoose from 'mongoose';
import validator from 'validator';
// import bcrypt from 'bcrypt';
import { IUser } from '../types';

//  схемы пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
  },
});

// userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
//   const user = await User.findOne({ email });
//   if (!user) {

//   }
//   try {

//   } catch {
//     return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
//   }
// });

export default mongoose.model<IUser>('user', userSchema);
