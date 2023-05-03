import { Request } from 'express';
import { Schema, Types } from 'mongoose';

export interface ICard {
  name: string,
  link: string,
  owner: Schema.Types.ObjectId,
  likes: [Types.ObjectId],
  createdAt: Date,
}

export interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string,
}

export interface ITestRequest extends Request {
  user?: {
    _id: string
  };
}
