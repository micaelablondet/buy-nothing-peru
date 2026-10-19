export type PostType = "regalo" | "pido" | "presto";
export type PostStatus = "active" | "given";

export interface Neighbor {
  id: string;
  firstName: string;
  phone: string;
  district: string;
  avatarColor: string;
}

export interface Post {
  id: string;
  type: PostType;
  status: PostStatus;
  authorId: string;
  title: string;
  description: string;
  category: string;
  district: string;
  imageUrls: string[];
  createdAt: string;
}

export interface CurrentUserProfile {
  firstName: string;
  phone: string;
  district: string;
  /** ISO date — when they joined Barrio */
  memberSince?: string;
}
