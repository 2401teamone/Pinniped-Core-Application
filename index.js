// Export HomeBase Functions
import HB from "./src/homebase/HB.js";

// Initialize App
const app = HB.createApp();

// Extensibility Invocations

//accepts multiple string arguments

app.onGetAllRows("random-table", "todos").add((event) => {
  console.log("RUNNING EVENT 1");
  // if (event.table === "random-test") event.res.status(200).send();
});

app.onGetAllRows("todos").add((event) => {
  console.log("RUNNING EVENT 2");
});

// app.onGetOneRow().add();

// Initialize server; Autogenerate API; Start server on desired port
app.start(3000);
