
    import DAO from "../src/dao/dao.js";

    export async function up(knex) {
      const oldTable = {"id":"ce35273b-e028-4e0c-ab9f-809257f5658f","name":"sloths18","columns":[{"id":"0156341b-0b05-434a-a314-8f312bdc5f54","name":"size","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const newTable = {"id":"ce35273b-e028-4e0c-ab9f-809257f5658f","name":"sloths18","columns":[{"id":"0156341b-0b05-434a-a314-8f312bdc5f54","name":"size","type":"text","options":{}},{"id":"f2b238c3-7ec9-4cef-b375-6cd8ceb54598","name":"favFood","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const oldColumns = [{"id":"0156341b-0b05-434a-a314-8f312bdc5f54","name":"size","type":"text","options":{}}];
      const newColumns = [{"id":"0156341b-0b05-434a-a314-8f312bdc5f54","name":"size","type":"text","options":{}},{"id":"f2b238c3-7ec9-4cef-b375-6cd8ceb54598","name":"favFood","type":"text","options":{}}];

      const dao = new DAO("", knex);

      // Delete Columns
      for (let oldColumn of oldColumns) {
        if (newColumns.find((newColumn) => oldColumn.id === newColumn.id)) continue;
        await dao.dropColumn(oldTable.name, oldColumn.name);
      }

      // Add OR Rename Columns
      for (let newColumn of newColumns) {
        let match = oldColumns.find((oldColumn) => oldColumn.id === newColumn.id);
        if (!match) {
          await dao.addColumn(oldTable.name, newColumn);
        }
        if (match && match.name !== newColumn.name) {
          await dao.renameColumn(oldTable.name, match.name, newColumn.name);
        }
      }

      // sets the table meta to the new table
      dao.updateTableMetaData({"id":"ce35273b-e028-4e0c-ab9f-809257f5658f","name":"sloths18","columns":"[{\"id\":\"0156341b-0b05-434a-a314-8f312bdc5f54\",\"name\":\"size\",\"type\":\"text\",\"options\":{}},{\"id\":\"f2b238c3-7ec9-4cef-b375-6cd8ceb54598\",\"name\":\"favFood\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"})
    }

    export async function down(knex) {
      //Run the exact same logic as the up method, but with new and old variables
      //swapped..
      const oldTable = {"id":"ce35273b-e028-4e0c-ab9f-809257f5658f","name":"sloths18","columns":[{"id":"0156341b-0b05-434a-a314-8f312bdc5f54","name":"size","type":"text","options":{}},{"id":"f2b238c3-7ec9-4cef-b375-6cd8ceb54598","name":"favFood","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const newTable = {"id":"ce35273b-e028-4e0c-ab9f-809257f5658f","name":"sloths18","columns":[{"id":"0156341b-0b05-434a-a314-8f312bdc5f54","name":"size","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const oldColumns = [{"id":"0156341b-0b05-434a-a314-8f312bdc5f54","name":"size","type":"text","options":{}},{"id":"f2b238c3-7ec9-4cef-b375-6cd8ceb54598","name":"favFood","type":"text","options":{}}];
      const newColumns = [{"id":"0156341b-0b05-434a-a314-8f312bdc5f54","name":"size","type":"text","options":{}}];

      const dao = new DAO("", knex);

      // sets the table meta to the old table
      dao.updateTableMetaData({"id":"ce35273b-e028-4e0c-ab9f-809257f5658f","name":"sloths18","columns":"[{\"id\":\"0156341b-0b05-434a-a314-8f312bdc5f54\",\"name\":\"size\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"})
    }

   