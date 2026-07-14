USE tokdak;
select * from users;
ALTER TABLE users
ADD COLUMN avatar_url VARCHAR(255) NULL AFTER gender;
