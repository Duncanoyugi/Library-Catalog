import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

interface CreateBookDto {
  title: string;
  author: string;
  publication_year?: number;
  isbn?: string;
}

interface Book extends CreateBookDto {
  id: number;
}

const books: Book[] = [];

@Controller('books')
export class BooksController {
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    if (books.some((b) => b.title === createBookDto.title)) {
      return {
        message: `Book with title "${createBookDto.title}" already exists`,
      };
    }
    const newBook = {
      id: books.length + 1,
      ...createBookDto,
    };
    books.push(newBook);
    return { message: 'Book created', data: newBook };
  }

  @Get()
  findAll(): Book[] {
    return books;
  }

  @Get('active')
  findActive() {
    return books;
  }

  @Get('title/:title')
  findByTitle(@Param('title') title: string) {
    const book = books.find((b) => b.title === title);
    if (!book) {
      return { message: 'Book not found' };
    }
    return book;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const book = books.find((b) => b.id === Number(id));
    if (!book) {
      return { message: 'Book not found' };
    }
    return book;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookDto: Partial<CreateBookDto>,
  ) {
    const bookIndex = books.findIndex((b) => b.id === Number(id));
    if (bookIndex === -1) {
      return { message: 'Book not found' };
    }
    if (
      updateBookDto.title &&
      books.some(
        (b, idx) => b.title === updateBookDto.title && idx !== bookIndex,
      )
    ) {
      return {
        message: `Book with title "${updateBookDto.title}" already exists`,
      };
    }
    books[bookIndex] = { ...books[bookIndex], ...updateBookDto };
    return { message: 'Book updated', data: books[bookIndex] };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const bookIndex = books.findIndex((b) => b.id === Number(id));
    if (bookIndex === -1) {
      return { message: 'Book not found' };
    }
    const deleted = books.splice(bookIndex, 1)[0];
    return { message: 'Book deleted', data: deleted };
  }
}
