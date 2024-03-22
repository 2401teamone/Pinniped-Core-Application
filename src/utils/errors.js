/**
 * Message
 * Status Code
 * Error Code
 * More detailed description
 */

class AppError extends Error {
  constructor(message, status, errorCode, detail) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.detail = detail;
  }
}

export class BadRequestError extends AppError {
  constructor(message = "This operation failed due to a bad request") {
    super(
      message,
      400,
      "BAD_REQUEST",
      "Failed to execute the request. Probably due to an invalid ID provided."
      );
    }
  }
  
export class TableNotFoundError extends AppError {
  constructor(tableId) {
    super(
      `Table with an id of ${tableId} was not found`,
      404,
      "TABLE_NOT_FOUND",
      "Table not found.  You've likely attempted to access a table that does not exist within the database."
    );
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access Denied") {
    super(
      message,
      403,
      "FORBIDDEN",
      "You don't have authorization to access this resource."
    );
  }
}

export class UnauthenticatedError extends AppError {
  constructor(message = "Unauthenticated user") {
    super(
      message,
      401,
      "UNAUTHENTICATED_USER",
      "You need to be logged in to access this resource."
    );
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication Error") {
    super(
      message,
      400,
      "AUTH_ERROR",
      "Please try again with updated credentials."
      );
    }
  }

  export class InvalidCustomRouteError extends AppError {
    constructor(message) {
      super(
        message,
        400,
        "INVALID_CUSTOM_ROUTE",
        "Your provided method, path, and/or handler were invalid per the custom route requirements.  Please visit our documentation to learn more."
      );
    }
  }
