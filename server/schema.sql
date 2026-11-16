-- Jalankan sekali: mysql -u root -p < schema.sql   (butuh MySQL 5.7+ atau MariaDB 10.2+)
create database if not exists bem_fge character set utf8mb4 collate utf8mb4_unicode_ci;
use bem_fge;

create table if not exists site_content (
  id         tinyint primary key,                 -- selalu 1: satu baris berisi seluruh konten website
  data       json not null,                       -- kabinet, profil, visi, misi, sejarah, struktur, berita, galeri, tema, dll.
  updated_at timestamp not null default current_timestamp on update current_timestamp
);
create table if not exists admin_users (
  id            int auto_increment primary key,
  username      varchar(100) not null unique,
  password_hash varchar(255) not null,
  created_at    timestamp not null default current_timestamp
);
create table if not exists media (                -- catatan setiap gambar yang diunggah lewat admin
  id            int auto_increment primary key,
  filename      varchar(255) not null,
  original_name varchar(255),
  mime          varchar(100),
  size          int,
  uploaded_at   timestamp not null default current_timestamp
);
