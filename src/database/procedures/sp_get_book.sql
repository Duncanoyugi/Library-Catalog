CREATE OR REPLACE FUNCTION sp_get_all_books()
RETURNS SETOF books AS $$
BEGIN
    RETURN QUERY SELECT * FROM books ORDER BY id;
END;
$$LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_active_books()
RETURNS SETOF books as $$
BEGIN
    RETURN  QUERY SELECT * FROM books WHERE  is_active = true ORDER BY id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_book_by_id(p_id INTEGER)
RETURNS SETOF books AS $$
BEGIN
    RETURN QUERY SELECT * FROM books WHERE id = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION ' Book with id % not found', p_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_book_by_title(p_title VARCHAR(255))
RETURNS SETOF books AS $$
BEGIN
    RETURN QUERY SELECT * FROM books WHERE title = p_title;

    IF NOT FOUND THEN
        RAISE EXCEPTION ' Book with title "%" not found', p_title;
    END IF;
END;
$$ LANGUAGE plpgsql;