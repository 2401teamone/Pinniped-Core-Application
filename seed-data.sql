DROP TABLE IF EXISTS tablemeta;

CREATE TABLE tablemeta 
  (id TEXT PRIMARY KEY, 
  name TEXT UNIQUE NOT NULL, 
  schema TEXT NOT NULL, 
  getAllRule TEXT DEFAULT 'public',
  getOneRule TEXT DEFAULT 'public',
  createRule TEXT DEFAULT 'public',
  updateRule TEXT DEFAULT 'public', 
  deleteRule TEXT DEFAULT 'public');