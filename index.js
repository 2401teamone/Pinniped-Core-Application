import { pnpd } from "./src/Pinniped/Pinniped.js";

const app = pnpd();

// Extensibility Invocations

// add custom routes
app.addRoute("GET", "/custom", (req, res, next) => {
  res.json({ custom: "elephant seals" });
});

// add event-driven functionality
app.onGetAllRows("Animals", "users").add((event) => {
  console.log("Triggered event: onGetAllRows");
});

app.onGetOneRow("Animals").add((event) => {
  console.log("Triggered event: GET ONE ROW");
});

app.onUpdateOneRow("Animals").add((event) => {
  console.log("Triggered event: UPDATE ONE ROW");
});

app.onDeleteOneRow("Animals").add((event) => {
  console.log("Triggered event: DELETE ONE ROW");
});

app.onCreateOneRow("Animals").add((event) => {
  console.log("Triggered event: INSERT ONE ROW");
});

app.start(3000);
