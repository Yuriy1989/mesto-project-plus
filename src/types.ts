import { Request } from 'express';
import { Schema, Types, Model, Document } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

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

export interface IUserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<Document<any, any, IUser>>;
}

export interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

export interface ITestRequest extends Request {
  user?: {
    _id: string
  };
}
