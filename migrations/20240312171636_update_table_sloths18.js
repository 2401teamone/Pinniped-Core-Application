
    import DAO from "../src/dao/dao.js";

    const oldTable = {"id":"ce35273b-e028-4e0c-ab9f-809257f5658f","name":"sloths18","columns":[{"id":"0156341b-0b05-434a-a314-8f312bdc5f54","name":"size","type":"text","options":{}},{"id":"550c7111-c9af-4412-b80a-6bd42d8317c2","name":"favFood","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
    const newTable = {"id":"ce35273b-e028-4e0c-ab9f-809257f5658f","name":"sloths18","columns":[{"id":"0156341b-0b05-434a-a314-8f312bdc5f54","name":"size","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
    const oldColumns = [{"id":"0156341b-0b05-434a-a314-8f312bdc5f54","name":"size","type":"text","options":{}},{"id":"550c7111-c9af-4412-b80a-6bd42d8317c2","name":"favFood","type":"text","options":{}}];
    const newColumns = [{"id":"0156341b-0b05-434a-a314-8f312bdc5f54","name":"size","type":"text","options":{}}];

    export async function up(knex) {
      const dao = new DAO("", knex);

      // Delete Columns
      for (let oldColumn of oldColumns) {
        if (newColumns.find((newColumn) => oldColumn.id === newColumn.id)) continue;
        await dao.dropColumn(oldTable.name, oldColumn.name);
      }

      dao.updateTableMetaData({"id":"ce35273b-e028-4e0c-ab9f-809257f5658f","name":"sloths18","columns":"[{\"id\":\"0156341b-0b05-434a-a314-8f312bdc5f54\",\"name\":\"size\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"})
    }

    export async function down(knex) {
      const dao = new DAO("", knex);

    }

   