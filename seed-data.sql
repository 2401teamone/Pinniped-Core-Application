DROP TABLE IF EXISTS todos;

CREATE TABLE todos (id INTEGER PRIMARY KEY, todo text);
INSERT INTO todos (todo) VALUES ('Todo 1'), ('Todo 2'), ('Todo 3');

DROP TABLE IF EXISTS t1;
CREATE TABLE t1 (id TEXT PRIMARY KEY, f1 text, f2 text, f3 text);
INSERT INTO t1 (id, f1, f2, f3) VALUES ('abcdefg', 'a', 'b', 'c'), ('hijklmnop', 'd', 'e', 'f'), ('qrstuv', 'g', 'h', 'i');

DROP TABLE IF EXISTS tablemeta;

CREATE TABLE tablemeta 
  (id TEXT PRIMARY KEY, 
  name TEXT UNIQUE NOT NULL, 
  columns TEXT NOT NULL, 
  getAllRule TEXT DEFAULT 'public',
  getOneRule TEXT DEFAULT 'public',
  createOneRule TEXT DEFAULT 'public',
  updateOneRule TEXT DEFAULT 'public', 
  deleteOneRule TEXT DEFAULT 'public');

INSERT INTO tablemeta (id, name, columns) 
VALUES 
  ('todosId', 'todos', '[{"name":"id","type":"text","primary":true},{"name":"todo","type":"text"}]'),
  ('t1Id', 't1', '[{"name":"id","type":"text","primary":true},{"name":"f1","type":"text"},{"name":"f2","type":"text"},{"name":"f3","type":"text"}]');


