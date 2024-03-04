# HomeBase-Core-Application

## Project Structure

- index.js - initializes the app with HB.createApp() which in turn opens a connection to the database within dao.js. You then have access to methods on the DAO class for interacting with the database.
- /api -
- /middleware
- initApi.js - Express server setup returns the express server to HB.js
- /dao - (Data Access Object)
  - dao.js - Connects the database and provides methods for interacting with DB
- /homebase -

- HB.js -
  defines the HB class that runs everything
  - /utils -
