export interface Book {
  id: string;
  title: string;
  author: string;
  publishedDate: Date | null;
  isbn: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt?: Date | null;
}
