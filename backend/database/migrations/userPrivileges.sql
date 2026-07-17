-- 1. Create Roles
CREATE ROLE tokdak_app;
CREATE ROLE tokdak_reader;
CREATE ROLE tokdak_admin;

-- 2. Define Privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON tokdak.* TO tokdak_app;
GRANT SELECT ON tokdak.* TO tokdak_reader;
GRANT ALL PRIVILEGES ON tokdak.* TO tokdak_admin WITH GRANT OPTION;

-- 3. Create Users
CREATE USER 'meng_db_admin'@'%' IDENTIFIED BY 'mengseang123@';
CREATE USER 'david_app_user'@'%' IDENTIFIED BY 'david123$';
CREATE USER 'report_user'@'%' IDENTIFIED BY 'report123$';
-- test create
create user 'testAdmin'@'%' IDENTIFIED by 'test1234!';


-- 4. Grant Roles to Users (Crucial step before setting defaults!)
GRANT tokdak_admin TO 'meng_db_admin'@'%';
GRANT tokdak_admin TO 'testAdmin'@'%';
GRANT tokdak_app TO 'david_app_user'@'%';
GRANT tokdak_reader TO 'report_user'@'%';

-- 5. Establish Default Active Status
SET DEFAULT ROLE tokdak_admin TO 'meng_db_admin'@'%';
SET DEFAULT ROLE tokdak_admin TO 'testAdmin'@'%';
SET DEFAULT ROLE tokdak_app TO 'david_app_user'@'%';
SET DEFAULT ROLE tokdak_reader TO 'report_user'@'%';
SHOW GRANTS;
