// Export HomeBase Functions
import HB from "./src/homebase/HB.js";

// Initialize App
const app = HB.createApp();

// Extensibility Invocations

app.addRoute("GET", "/custom", (req, res, next) => {
  res.json({ custom: "elephant seals" });
});

// Throws an error because you can't register a custom route that starts with API
// app.addRoute("GET", "/api/custom", (req, res, next) => {
//   res.json({ custom: "elephant seals" });
// });

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
