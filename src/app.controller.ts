import { Controller, Post, Body } from '@nestjs/common';

interface CreateBookDto {
  title: string;
  author: string;
  publishedDate?: string;
  // Add other fields as needed
}

@Controller('books')
export class BooksController {
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    // Your logic to create a book
    return { message: 'Book created', data: createBookDto };
  }
}
