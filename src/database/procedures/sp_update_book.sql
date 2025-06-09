CREATE OR REPLACE FUNCTION sp_update_book(
    p_id INTEGER,
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
DECLARE
current_title VARCHAR(255);
BEGIN
    SELECT books.title INTO current_title FROM books WHERE books.id = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION ' Book with id % not found',p_id;
    END IF;

    IF p_title IS NOT NULL AND p_title != current_title THEN
        IF EXISTS (SELECT 1 FROM books WHERE books.title = p.title AND books.id !=p.id) THEN
            RAISE EXCEPTION 'Another book with this title exists';
        END IF;
    END IF;

    RETURN QUERY
    UPDATE books SET
        title = COALESCE(p_title, books.title),
        author = COALESCE(p_author, users.author),
        publication_year = COALESCE(p_publication_year, books.publication_year),
        isbn = COALESCE(p_isbn, books.isbn)
    WHERE books.id = p_id
    RETURNING books.id, books.title, books.author, books.publication_year, books.isbn;
END;
$$ LANGUAGE plpgsql;

        