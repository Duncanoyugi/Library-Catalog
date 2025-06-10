/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Book } from './interfaces/book.interface';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DatabaseService } from '../database/connection.service';

@Injectable()
export class BooksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateBookDto): Promise<Book> {
    try {
      const result = await this.databaseService.query(
        `SELECT * FROM sp_create_book($1, $2, $3, $4, $5, $6)`,
        [
          data.title,
          data.author,
          data.publishedDate || null,
          data.isbn || null,
        ],
      );

      if (result.rows.length === 0) {
        throw new InternalServerErrorException('Failed to create book');
      }

      return this.mapRowToBook(result.rows[0]);
    } catch (error: any) {
      if (error instanceof Error && error.message.includes('already exists')) {
        throw new ConflictException(error.message);
      }
      if (
        error instanceof Error &&
        error.message.includes('update date must be after create date')
      ) {
        throw new ConflictException('update date must be after create date');
      }
      throw new InternalServerErrorException('Failed to create book');
    }
  }

  async findAll(): Promise<Book[]> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_all_books()',
      );
      return result.rows.map((row: any) => this.mapRowToBook(row));
    } catch {
      throw new InternalServerErrorException('Failed to retrieve books');
    }
  }

  async findActive(): Promise<Book[]> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_active_books()',
      );
      return result.rows.map((row: any) => this.mapRowToBook(row));
    } catch {
      throw new InternalServerErrorException('Failed to retrieve active books');
    }
  }

  async findOne(id: number): Promise<Book> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_book_by_id($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }

      return this.mapRowToBook(result.rows[0]);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to retrieve book');
    }
  }

  async findByTitle(title: string): Promise<Book> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_book_by_title($1)',
        [title],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with title ${title} not found`);
      }

      return this.mapRowToBook(result.rows[0]);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Book with title ${title} not found`);
      }
      throw new InternalServerErrorException(
        'Failed to retrieve book by title',
      );
    }
  }

  async update(id: number, data: UpdateBookDto): Promise<Book> {
    try {
      const result = await this.databaseService.query(
        `SELECT * FROM sp_update_book($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          id,
          data.title || null,
          data.author || null,
          data.publishedDate || null,
          data.isbn || null,
        ],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }

      return this.mapRowToBook(result.rows[0]);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }
      if (
        error instanceof Error &&
        error.message.includes('Another book with this title exists')
      ) {
        throw new ConflictException('Another book with this title exists');
      }
      if (
        error instanceof Error &&
        error.message.includes('Update date must be after create date')
      ) {
        throw new ConflictException('Update date must be after create date');
      }
      throw new InternalServerErrorException('Failed to update book');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_soft_delete_book($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }

      return { message: result.rows[0].message };
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to checkout book');
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_hard_delete_book($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      return { message: result.rows[0].message };
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to delete book');
    }
  }

  private mapRowToBook(row: any): Book {
    return {
      id: row.id,
      title: row.title,
      author: row.author,
      publishedDate: row.published_date
        ? new Date(row.published_date as string)
        : null,
      isbn: row.isbn,
      createdAt: row.created_at ? new Date(String(row.created_at)) : null,
      updatedAt: row.updated_at ? new Date(row.updated_at as string) : null,
      deletedAt: row.deleted_at ? new Date(String(row.deleted_at)) : null,
    };
  }
}
