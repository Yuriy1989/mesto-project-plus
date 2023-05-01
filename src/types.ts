import { Request } from "express";
const ObjectID = require("mongodb").ObjectID;
type ObjectID = typeof import("mongodb").ObjectID;

export interface ICard {
  name: string,
  link: string,
  owner: ObjectID,
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