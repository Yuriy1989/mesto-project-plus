import mongoose from "mongoose";

export interface IUser {
  name: string,
  about: string,
  avatar: string,
}

//схемы пользователя
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
  }
});

export default mongoose.model<IUser>('user', userSchema);