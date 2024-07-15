import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

export type TagInput = {
  name: Required<String>;
};

export type Photo = {
  id: string;
  _id: string;
  src: string;
  description?: string;
};

export enum Privacy {
  ALL = 'ALL',
  FAMILY = 'FAMILY',
  FRIENDS = 'FRIENDS',
  CLOSE_FRIENDS = 'CLOSE_FRIENDS',
  TSVETTA = 'TSVETTA',
}

export type PostInput = {
  date: Date;
  title: string;
  photos: Photo[];
  tags: string[];
  text: string;
  privacy: Required<Privacy>;
};

export type CreateUserInput = {
  username: string;
  password: string;
  role: Required<Privacy>;
};

export type User = {
  _id: Types.ObjectId;
  username: string;
  password?: string;
  role: `${Privacy}`;
  refreshToken?: string | null;
};

export interface UserDataFromToken extends JwtPayload {
  userId: string;
  username: string;
  role: Privacy;
}
