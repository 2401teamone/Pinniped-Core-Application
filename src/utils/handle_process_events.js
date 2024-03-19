import process from "process";

const handleProcessEvents = (app) => {
  // Close database connection and exit process
  const cleanupAndExit = () => {
    app.getDAO().disconnect();
  };

  // Triggerd when Ctrl+C is pressed
  process.on("SIGINT", cleanupAndExit);

  // Triggered when a Process manager shuts down the process, or a container is stopped
  process.on("SIGTERM", cleanupAndExit);

  // Triggered when an unhandled exception occurs
  process.on("uncaughtException", cleanupAndExit);
};

export default handleProcessEvents;
