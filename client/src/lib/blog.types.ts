export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string;
  category: string | null;
  readingTime: number | null;
  createdAt: string;
}