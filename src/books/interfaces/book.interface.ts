export interface Book {
  id: string;
  title: string;
  author: string;
  publishedDate: Date;
  isbn: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
