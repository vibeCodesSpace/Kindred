export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  interests?: string[];
  role: 'user' | 'admin';
  createdAt: any;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: string[];
  createdAt: any;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  createdAt: any;
}

export interface Event {
  id: string;
  communityId: string;
  title: string;
  description?: string;
  location?: string;
  startTime: any;
  attendees: string[];
  creatorId: string;
  createdAt: any;
}
