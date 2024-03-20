DROP TABLE IF EXISTS tablemeta;
CREATE TABLE tablemeta
  (id TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))),
  name TEXT UNIQUE NOT NULL,
  columns TEXT NOT NULL,
  getAllRule TEXT DEFAULT 'public',
  getOneRule TEXT DEFAULT 'public',
  createRule TEXT DEFAULT 'public',
  updateRule TEXT DEFAULT 'public',
  deleteRule TEXT DEFAULT 'public');

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'user');

DROP TABLE IF EXISTS _admins;
CREATE TABLE _admins (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'admin');
