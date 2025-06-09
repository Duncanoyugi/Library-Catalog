CREATE OR REPLACE FUNCTION sp_soft_delete_book(p_id INTEGER)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    title VARCHAR(255)
) AS $$
DECLARE
    current_title VARCHAR(255);
BEGIN
    -- Check if book exists and get current title
    SELECT books.title INTO current_title FROM books WHERE books.id = p_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Book with id % not found', p_id;
    END IF;
    -- Soft delete the book
    UPDATE books SET is_active = false WHERE books.id = p_id;
    RETURN QUERY SELECT true, 'Book "' || current_title || '" has been checked out successfully', current_title;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_hard_delete_book(p_id INTEGER)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    deleted_title VARCHAR(255);
BEGIN
    -- Get the book title before deletion
    SELECT books.title INTO deleted_title FROM books WHERE books.id = p_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Book with ID % not found', p_id;
    END IF;
    -- Delete the book
    DELETE FROM books WHERE books.id = p_id;
    RETURN QUERY SELECT true, 'Book "' || deleted_title || '" has been permanently deleted';
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_restore_book(p_id INTEGER)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    title VARCHAR(255)
) AS $$
DECLARE
    current_title VARCHAR(255);
BEGIN
    -- Check if book exists and get current title
    SELECT books.title INTO current_title FROM books WHERE books.id = p_id AND is_active = false;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Book with id % not found or is already active', p_id;
    END IF;
    -- Restore the book
    UPDATE books SET is_active = true WHERE books.id = p_id;
    RETURN QUERY SELECT true, 'Book "' || current_title || '" has been restored successfully', current_title;
END;
$$ LANGUAGE plpgsql;