import { Timestamp, FieldValue } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  interests?: string[];
  role: 'user' | 'admin';
  createdAt: Timestamp | FieldValue;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: string[];
  createdAt: Timestamp | FieldValue;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  createdAt: Timestamp | FieldValue;
}

export interface Event {
  id: string;
  communityId: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Timestamp | FieldValue;
  attendees: string[];
  creatorId: string;
  createdAt: Timestamp | FieldValue;
}
