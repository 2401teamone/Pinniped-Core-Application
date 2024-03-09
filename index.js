import HB from "./src/homebase/HB.js";

const app = HB.createApp();

// Extensibility Invocations
app.addRoute("GET", "/custom", (req, res, next) => {
  res.json({ custom: "elephant seals" });
});

// API Path is Reserved
// app.addRoute("GET", "/api/custom", (req, res, next) => {
//   res.json({ custom: "elephant seals" });
// });

app.onGetAllRows("random-table", "todos").add((event) => {
  // console.log("RUNNING EVENT 1");
  // if (event.table === "random-test") event.res.status(200).send();
});

app.onGetAllRows("todos").add((event) => {
  // console.log("RUNNING EVENT 2");
});

// app.onGetOneRow().add();

app.start(3000);
