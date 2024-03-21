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

app.start(3000);
