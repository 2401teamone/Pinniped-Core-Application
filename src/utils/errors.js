class AppError extends Error {
  constructor(msg, status, type, detail, errorCode) {
    super(msg);
    this.status = status;
    this.detail = detail;
    this.errorCode = errorCode;
  }
}

export class TableNotFoundError extends AppError {
  constructor(table) {
    super(
      `Table ${table} not found`,
      404,
      "TableNotFoundError",
      `Table ${table} not found.  You've likely attempted to access a table that does not exist within the database`,
      "TABLE_NOT_FOUND"
    );
  }
}

export class DatabaseError extends AppError {
  constructor(table, message) {
    super(
      `Table ${table} not found`,
      404,
      "TableNotFoundError",
      `Table ${table} not found.  You've likely attempted to access a table that does not exist within the database`,
      "TABLE_NOT_FOUND"
    );
  }
}

export class BadRequestError extends AppError {
  constructor(table) {
    super(
      "Hmm this operation didn't work",
      400,
      "BadRequestError",
      "Failed to execute the request.  This is likely due to...",
      "BAD_REQUEST"
    );
  }
}
