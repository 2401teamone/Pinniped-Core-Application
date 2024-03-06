DROP TABLE IF EXISTS todos;

CREATE TABLE todos (id INTEGER PRIMARY KEY, todo text);
INSERT INTO todos (todo) VALUES ('Todo 1'), ('Todo 2'), ('Todo 3');

DROP TABLE IF EXISTS tablemeta;

CREATE TABLE tablemeta 
  (id INTEGER PRIMARY KEY, 
  name TEXT UNIQUE NOT NULL, 
  columns TEXT NOT NULL, 
  getAllRule TEXT DEFAULT 'public',
  getOneRule TEXT DEFAULT 'public',
  createOneRule TEXT DEFAULT 'public',
  updateOneRule TEXT DEFAULT 'public', 
  deleteOneRule TEXT DEFAULT 'public');

INSERT INTO tablemeta (name, columns) 
VALUES 
  ('todos', '[{"name":"todo","type":"text"}]');