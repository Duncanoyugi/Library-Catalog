export class GetBookDto {
  id: string;
  title: string;
  author: string;
  publishedDate: Date;
  isbn: string;
  genre: string;
  summary?: string;
}
export class GetBookResponseDto {
  id: string;
  title: string;
  author: string;
  publishedDate: Date;
  isbn: string;
}
export class GetBookByIdResponseDto {
  id: string;
  title: string;
  author: string;
  publishedDate: Date;
  isbn: string;
}
