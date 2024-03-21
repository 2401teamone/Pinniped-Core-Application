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
  console.log("Triggered event: CREATE ONE ROW");
});

app.onBackupDatabase().add((event) => {
  console.log("Triggered event: BACKUP_DATABASE");
});

app.onLogout().add((event) => {
  console.log("Triggered event: LOGOUT");
});

app.onLoginUser().add((event) => {
  console.log("Triggered event: LOGIN");
});

app.onRegisterAdmin().add((event) => {
  console.log("Triggered event: ON_REGISTER_ADMIN");
});

app.onLoginAdmin().add((event) => {
  console.log("Triggered event: LOGIN_ADMIN");
});

app.onRegisterUser().add((event) => {
  console.log("Triggered event: REGISTER_USER");
});

app.onCustomRoute().add((event) => {
  console.log("Triggered event: CUSTOM_ROUTE");
});

app.onGetTableMeta().add((event) => {
  console.log("Triggered Event: TABLE_META_GET");
});

app.onCreateTable().add((event) => {
  console.log("Triggered Event: CREATE TABLE");
});

app.onUpdateTable().add((event) => {
  console.log("Triggered Event: UPDATE TABLE");
});

app.onDropTable().add((event) => {
  console.log("Triggered Event: DROP TABLE");
});

app.start(3000);
