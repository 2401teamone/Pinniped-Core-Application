import process from "process";

/**
 * Registers process event handlers to close the database connection
 * and exit the process when the application is terminated.
 * @param {object} app - The Pinniped application instance.
 * @returns {undefined}
 */
const handleProcessEvents = (app) => {
  /**
   * Closes the database connection and exits the process with a status code of 0.
   * @returns {Promise<void>}
   */
  const cleanExit = async () => {
    await app.getDAO().disconnect();
    console.log("\n Database connection closed");
    process.exit(0);
  };

  /**
   * Closes the database connection and exits the process with a status code of 1.
   * @param {Error} error - The unhandled exception.
   * @returns {Promise<void>}
   */
  const errorExit = async (error) => {
    console.error("Uncaught Exception:", error);
    await app.getDAO().disconnect();
    console.log("\n Database connection closed");
    process.exit(1);
  };

  // Triggerd when Ctrl+C is pressed
  process.on("SIGINT", cleanExit);

  // Triggered when a Process manager shuts down the process, or a container is stopped
  process.on("SIGTERM", cleanExit);

  // Triggered when an unhandled exception occurs
  process.on("uncaughtException", errorExit);
};

export default handleProcessEvents;
