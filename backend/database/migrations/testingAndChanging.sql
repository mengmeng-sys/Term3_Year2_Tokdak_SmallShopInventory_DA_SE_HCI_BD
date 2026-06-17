use tokdak;
update users
SET password ="$2b$10$bryvsvFwJ2VQRQWS7Frcou6woLbn6XzDg5sW98O5XMpnk5VY5hp36"
where email ="admin@tokdak.com";

use tokdak;
select * from users;
select * from users where email = 'admin@tokdak.com';
--ad otp table
ALTER TABLE users 
ADD COLUMN reset_otp VARCHAR(6) NULL,
ADD COLUMN reset_otp_expires DATETIME NULL;

show databases;
show tables;
desc users;