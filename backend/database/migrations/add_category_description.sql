USE tokdak;
ALTER TABLE categories
ADD COLUMN description VARCHAR(255) NULL AFTER name;
