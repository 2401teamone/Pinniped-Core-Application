
    import DAO from "../src/dao/dao.js";

    export async function up(knex) {
      const oldTable = {"id":"b4d5a934-140a-4bc7-9326-145c9638843c","name":"JoshTable","columns":[{"id":"59c5f51b-865b-4aaa-a2e3-d31457621739","name":"size","type":"text","options":{}},{"id":"f2498a1d-27e8-4bdf-8f95-89942b307770","name":"favFood","type":"text","options":{}},{"id":"f8eb46aa-a158-458a-bc4c-73a1cd9b0bfe","name":"favColor","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const newTable = {"id":"b4d5a934-140a-4bc7-9326-145c9638843c","name":"JoshTable","columns":[{"id":"59c5f51b-865b-4aaa-a2e3-d31457621739","name":"size","type":"text","options":{}},{"id":"f2498a1d-27e8-4bdf-8f95-89942b307770","name":"favFood","type":"text","options":{}},{"id":"f8eb46aa-a158-458a-bc4c-73a1cd9b0bfe","name":"FAVCOLOR","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const oldColumns = [{"id":"59c5f51b-865b-4aaa-a2e3-d31457621739","name":"size","type":"text","options":{}},{"id":"f2498a1d-27e8-4bdf-8f95-89942b307770","name":"favFood","type":"text","options":{}},{"id":"f8eb46aa-a158-458a-bc4c-73a1cd9b0bfe","name":"favColor","type":"text","options":{}}];
      const newColumns = [{"id":"59c5f51b-865b-4aaa-a2e3-d31457621739","name":"size","type":"text","options":{}},{"id":"f2498a1d-27e8-4bdf-8f95-89942b307770","name":"favFood","type":"text","options":{}},{"id":"f8eb46aa-a158-458a-bc4c-73a1cd9b0bfe","name":"FAVCOLOR","type":"text","options":{}}];

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
      await dao.updateTableMetaData({"id":"b4d5a934-140a-4bc7-9326-145c9638843c","name":"JoshTable","columns":"[{\"id\":\"59c5f51b-865b-4aaa-a2e3-d31457621739\",\"name\":\"size\",\"type\":\"text\",\"options\":{}},{\"id\":\"f2498a1d-27e8-4bdf-8f95-89942b307770\",\"name\":\"favFood\",\"type\":\"text\",\"options\":{}},{\"id\":\"f8eb46aa-a158-458a-bc4c-73a1cd9b0bfe\",\"name\":\"FAVCOLOR\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"})
    }

    export async function down(knex) {
      //Run the exact same logic as the up method, but with new and old variables
      //swapped..
      const oldTable = {"id":"b4d5a934-140a-4bc7-9326-145c9638843c","name":"JoshTable","columns":[{"id":"59c5f51b-865b-4aaa-a2e3-d31457621739","name":"size","type":"text","options":{}},{"id":"f2498a1d-27e8-4bdf-8f95-89942b307770","name":"favFood","type":"text","options":{}},{"id":"f8eb46aa-a158-458a-bc4c-73a1cd9b0bfe","name":"FAVCOLOR","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const newTable = {"id":"b4d5a934-140a-4bc7-9326-145c9638843c","name":"JoshTable","columns":[{"id":"59c5f51b-865b-4aaa-a2e3-d31457621739","name":"size","type":"text","options":{}},{"id":"f2498a1d-27e8-4bdf-8f95-89942b307770","name":"favFood","type":"text","options":{}},{"id":"f8eb46aa-a158-458a-bc4c-73a1cd9b0bfe","name":"favColor","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const oldColumns = [{"id":"59c5f51b-865b-4aaa-a2e3-d31457621739","name":"size","type":"text","options":{}},{"id":"f2498a1d-27e8-4bdf-8f95-89942b307770","name":"favFood","type":"text","options":{}},{"id":"f8eb46aa-a158-458a-bc4c-73a1cd9b0bfe","name":"FAVCOLOR","type":"text","options":{}}];
      const newColumns = [{"id":"59c5f51b-865b-4aaa-a2e3-d31457621739","name":"size","type":"text","options":{}},{"id":"f2498a1d-27e8-4bdf-8f95-89942b307770","name":"favFood","type":"text","options":{}},{"id":"f8eb46aa-a158-458a-bc4c-73a1cd9b0bfe","name":"favColor","type":"text","options":{}}];

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

      // sets the table meta to the old table
      await dao.updateTableMetaData({"id":"b4d5a934-140a-4bc7-9326-145c9638843c","name":"JoshTable","columns":"[{\"id\":\"59c5f51b-865b-4aaa-a2e3-d31457621739\",\"name\":\"size\",\"type\":\"text\",\"options\":{}},{\"id\":\"f2498a1d-27e8-4bdf-8f95-89942b307770\",\"name\":\"favFood\",\"type\":\"text\",\"options\":{}},{\"id\":\"f8eb46aa-a158-458a-bc4c-73a1cd9b0bfe\",\"name\":\"favColor\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"})
    }
   