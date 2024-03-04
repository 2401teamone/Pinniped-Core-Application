// Export HomeBase Functions
import HB from "./src/homebase/HB.js";

// Initialize App
const app = HB.createApp();

// Extensibility Invocations
// app.onGetAllRecords().add();

// Initialize server; Autogenerate API; Start server on desired port
app.start(3000);
