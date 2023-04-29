import mongoose from "mongoose";

export interface ICard {
  name: string,
  link: string,
  owner: any,
  likes: any,
  createdAt: Date,
}

//схемы карточки
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: [],
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICard>('card', cardSchema);