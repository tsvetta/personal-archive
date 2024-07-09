import { JwtPayload } from 'jsonwebtoken';

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
  title: String;
  photos: Photo[];
  tags: String[];
  text: String;
  privacy: Required<Privacy>;
};

export type UserInput = {
  username: String;
  password: String;
  role: Required<Privacy>;
};

export interface UserDataFromToken extends JwtPayload {
  userId: String;
  username: String;
  role: Privacy;
}
