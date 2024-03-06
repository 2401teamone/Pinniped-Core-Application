import { v4 as uuidv4 } from "uuid";

class Column {
  constructor({ id = uuidv4(), name, type, options = {} }) {
    this.id = id;
    this.name = name;
    this.type = type;
    //this.options = options;
  }
}

export default Column;
