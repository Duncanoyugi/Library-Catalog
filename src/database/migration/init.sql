CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  publication_year INT,
  isbn VARCHAR(13)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);

-- Stored Procedure
CREATE OR REPLACE FUNCTION count_books_by_year(year INT)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM books WHERE publication_year = year);
END;
$$ LANGUAGE plpgsql;
