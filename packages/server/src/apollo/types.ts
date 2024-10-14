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

export enum AccessLevelsEnum {
  ALL = 0,
  FAMILY = 1,
  FRIENDS = 2,
  CLOSE_FRIENDS = 3,
  TSVETTA = 4,
}

export enum Season {
  SPRING = 1,
  SUMMER = 2,
  AUTUMN = 3,
  WINTER = 4,
}

export type CustomDate = {
  year: number;
  month?: number;
  season?: Season;
};

export type PostInput = {
  date: Date | CustomDate;
  title: string;
  photos: Photo[];
  tags: string[];
  text: string;
  accessLevel: AccessLevelsEnum;
};

export type CreateUserInput = {
  username: string;
  password: string;
  role?: Privacy;
  accessLevel: AccessLevelsEnum;
};

export type User = {
  _id: Types.ObjectId;
  username: string;
  password?: string;
  role?: `${Privacy}`;
  accessLevel: AccessLevelsEnum;
  refreshToken?: string | null;
};

export interface UserDataFromToken extends JwtPayload {
  userId: Types.ObjectId;
  username: string;
  role?: Privacy;
  accessLevel: AccessLevelsEnum;
}
