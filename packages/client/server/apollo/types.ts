import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

export type TagInput = {
  name: String;
};

export type Tag = {
  _id: String;
  name: String;
};

export type Photo = {
  _id: string;
  src?: string;
  file?: {
    _id: Types.ObjectId;
    fileUrl: string;
    filePreview?: string;
  };
  description?: string;
  fromGallery?: boolean;
};

export enum Privacy {
  ALL = 'ALL',
  FAMILY = 'FAMILY',
  FRIENDS = 'FRIENDS',
  CLOSE_FRIENDS = 'CLOSE_FRIENDS',
  TSVETTA = 'TSVETTA',
}

export type AccessLevels = 0 | 1 | 2 | 3 | 4;

export enum AccessLevelsEnum {
  ALL = 0,
  FAMILY = 1,
  FRIENDS = 2,
  CLOSE_FRIENDS = 3,
  TSVETTA = 4,
}

export type PostInput = {
  date: Date;
  title: string;
  photos: Photo[];
  tags: string[];
  text: string;
  accessLevel: number;
};

export type CreateUserInput = {
  username: string;
  password: string;
  role?: Privacy;
  accessLevel: AccessLevels;
};

export type User = {
  _id: Types.ObjectId;
  username: string;
  password?: string;
  role?: `${Privacy}`;
  accessLevel: AccessLevels;
  refreshToken?: string | null;
};

export interface UserDataFromToken extends JwtPayload {
  userId: Types.ObjectId;
  username: string;
  role?: Privacy;
  accessLevel: AccessLevels;
}
