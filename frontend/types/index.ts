export interface IUser {
  _id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
  email: string;
}

export interface IMessage {
  _id: string;
  chat: string;
  sender: IUser | string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface IChat {
  _id: string;
  participants: IUser[];
  lastMessage?: IMessage;
  updatedAt: string;
}