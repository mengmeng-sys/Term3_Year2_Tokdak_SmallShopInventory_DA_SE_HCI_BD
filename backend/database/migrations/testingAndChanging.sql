use tokdak;
update users
SET password ="$2b$10$bryvsvFwJ2VQRQWS7Frcou6woLbn6XzDg5sW98O5XMpnk5VY5hp36"
where email ="admin@tokdak.com";

use tokdak;
select * from shops;

select * from users;
desc stock_transactions;

select * from products where shop_id=1;
show create table shops;
CREATE TABLE userTemp(
    email VARCHAR(150) PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    rPassword VARCHAR(255) not null,

    DOB         DATE,

    gender      ENUM('male','female','other'),

    shop_name VARCHAR(150) NOT NULL,

    address VARCHAR(255),

    phone VARCHAR(20),

    password VARCHAR(255) NOT NULL,

    reset_otp VARCHAR(6),

    reset_otp_expires DATETIME
);
alter table `userTemp`
add COLUMN     DOB         DATE,
ADD   gender      ENUM('male','female','other');
add COLUMN  rPassword VARCHAR(255) not null;
--ad otp table
ALTER TABLE users 
ADD COLUMN reset_otp VARCHAR(6) NULL,
ADD COLUMN reset_otp_expires DATETIME NULL;
alter table `userTemp` 
add COLUMN  rPassword VARCHAR(255) not null;
ALTER TABLE users
ADD is_active BOOLEAN NOT NULL DEFAULT TRUE;
update users set email='oumrothana007@gmail.com' where user_id =3;
SELECT shop_id, user_id, shop_name, address, phone, created_at FROM shops WHERE user_id = 2;
show tables;
desc `userTemp`;
select * from `userTemp`;
TRUNCATE table `userTemp`;
drop table `userTemp`;
select * from alerts ;
