CREATE OR REPLACE FUNCTION sp_create_book(
  p_title VARCHAR(255),
  p_author VARCHAR(255),
  p_publication_year INT,
  p_isbn VARCHAR(13)
)
RETURNS TABLE(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  publication_year INT,
  isbn VARCHAR(13)
) AS $$
BEGIN 
    IF EXISTS (SELECT 1 FROM books WHERE books.title = p_title) THEN
        RAISE EXCEPTION ' Book with title "%" already exists', p_title;
    END IF;

    RETURN QUERY
    INSERT INTO books (title, author, publication_year, isbn)
    VALUES(p_title, p_author, p_publication_year, p_isbn)
    RETURNING books.id, books.title, books.author, books.publication_year, books.isbn;
    END;
    $$ language plpgsql;
