export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  image: string;
};

export type UserCreate = {
  username: string;
  email: string;
  password: string;
  role: string;
  image: string;
};

export type UserUpdate = {
  username: string;
  email: string;
  role: string;
  image: string;
};