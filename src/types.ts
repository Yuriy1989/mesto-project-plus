import { Request } from "express";

export interface ICard {
  name: string,
  link: string,
  owner: any,
  createdAt: Date,
}

export interface IUser {
  name: string,
  about: string,
  avatar: string | undefined,
}

export interface ITestRequest extends Request {
  user?: {
    _id: string,
  }
}