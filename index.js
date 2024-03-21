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
  // console.log(event.data);
});

app.onGetOneRow("Animals").add((event) => {
  console.log("Triggered event: GET ONE ROW");
  console.log(event.data);
});

app.onUpdateOneRow("Animals").add((event) => {
  console.log("Triggered event: UPDATE ONE ROW");
  console.log(event.data);
});

app.onDeleteOneRow("Animals").add((event) => {
  console.log("Triggered event: DELETE ONE ROW");
  console.log(event.data);
});

app.onCreateOneRow("Animals").add((event) => {
  console.log("Triggered event: CREATE ONE ROW");
  console.log(event.data);
});

app.onBackupDatabase().add((event) => {
  console.log("Triggered event: BACKUP_DATABASE");
  console.log(event.data);
});

app.onLogout().add((event) => {
  console.log("Triggered event: LOGOUT");
  console.log(event.data);
});

app.onLoginUser().add((event) => {
  console.log("Triggered event: LOGIN");
  console.log(event.data);
});

app.onRegisterAdmin().add((event) => {
  console.log("Triggered event: ON_REGISTER_ADMIN");
  console.log(event.data);
});

app.onLoginAdmin().add((event) => {
  console.log("Triggered event: LOGIN_ADMIN");
  console.log(event.data);
});

app.onRegisterUser().add((event) => {
  console.log("Triggered event: REGISTER_USER");
  console.log(event.data);
});
app.start(3000);
