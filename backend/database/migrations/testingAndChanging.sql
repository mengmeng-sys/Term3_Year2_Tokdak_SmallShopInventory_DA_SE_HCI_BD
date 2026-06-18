use tokdak;
update users
SET password ="$2b$10$bryvsvFwJ2VQRQWS7Frcou6woLbn6XzDg5sW98O5XMpnk5VY5hp36"
where email ="admin@tokdak.com";

use tokdak;
select * from users;
show create table shops;
--ad otp table
ALTER TABLE users 
ADD COLUMN reset_otp VARCHAR(6) NULL,
ADD COLUMN reset_otp_expires DATETIME NULL;
ALTER TABLE users
ADD is_active BOOLEAN NOT NULL DEFAULT TRUE;
update users set email='oumrothana007@gmail.com' where user_id =3;
SELECT shop_id, user_id, shop_name, address, phone, created_at FROM shops WHERE user_id = 2;