
    import DAO from "../src/dao/dao.js";

    export async function up(knex) {
      const oldTable = {"id":"df7e1268-b378-43f5-9954-6b9ecaf9a62a","name":"ElephantSeals","columns":[{"id":"3e0f91d5-6769-4b36-9412-f568741db545","name":"size","type":"text","options":{}},{"id":"0c6726c7-9775-451d-8c82-ef990b281a76","name":"favFood","type":"text","options":{}},{"id":"e0b1571f-290e-4f2d-9cae-59ba6c5b0427","name":"favColor","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const newTable = {"id":"df7e1268-b378-43f5-9954-6b9ecaf9a62a","name":"Pinnipeds","columns":[{"id":"3e0f91d5-6769-4b36-9412-f568741db545","name":"size","type":"text","options":{}},{"id":"0c6726c7-9775-451d-8c82-ef990b281a76","name":"favFood","type":"text","options":{}},{"id":"e0b1571f-290e-4f2d-9cae-59ba6c5b0427","name":"favColor","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const oldColumns = [{"id":"3e0f91d5-6769-4b36-9412-f568741db545","name":"size","type":"text","options":{}},{"id":"0c6726c7-9775-451d-8c82-ef990b281a76","name":"favFood","type":"text","options":{}},{"id":"e0b1571f-290e-4f2d-9cae-59ba6c5b0427","name":"favColor","type":"text","options":{}}];
      const newColumns = [{"id":"3e0f91d5-6769-4b36-9412-f568741db545","name":"size","type":"text","options":{}},{"id":"0c6726c7-9775-451d-8c82-ef990b281a76","name":"favFood","type":"text","options":{}},{"id":"e0b1571f-290e-4f2d-9cae-59ba6c5b0427","name":"favColor","type":"text","options":{}}];

      const dao = new DAO("", knex);

      // Delete Columns (Tested)
      for (let oldColumn of oldColumns) {
        if (newColumns.find((newColumn) => oldColumn.id === newColumn.id)) continue;
        await dao.dropColumn(oldTable.name, oldColumn.name);
      }

      // Add OR Rename Columns (Renaming Tested, Adding tested)
      for (let newColumn of newColumns) {
        let match = oldColumns.find((oldColumn) => oldColumn.id === newColumn.id);
        if (!match) {
          await dao.addColumn(oldTable.name, newColumn);
        }
        if (match && match.name !== newColumn.name) {
          await dao.renameColumn(oldTable.name, match.name, newColumn.name);
        }
      }

      // Rename Table
      if (oldTable.name !== newTable.name) {
        await dao.renameTable(oldTable.name, newTable.name);
      }

      // sets the table meta to the new table
      await dao.updateTableMetaData({"id":"df7e1268-b378-43f5-9954-6b9ecaf9a62a","name":"Pinnipeds","columns":"[{\"id\":\"3e0f91d5-6769-4b36-9412-f568741db545\",\"name\":\"size\",\"type\":\"text\",\"options\":{}},{\"id\":\"0c6726c7-9775-451d-8c82-ef990b281a76\",\"name\":\"favFood\",\"type\":\"text\",\"options\":{}},{\"id\":\"e0b1571f-290e-4f2d-9cae-59ba6c5b0427\",\"name\":\"favColor\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"})
    }

    export async function down(knex) {
      //Run the exact same logic as the up method, but with new and old variables
      //swapped..
      const oldTable = {"id":"df7e1268-b378-43f5-9954-6b9ecaf9a62a","name":"Pinnipeds","columns":[{"id":"3e0f91d5-6769-4b36-9412-f568741db545","name":"size","type":"text","options":{}},{"id":"0c6726c7-9775-451d-8c82-ef990b281a76","name":"favFood","type":"text","options":{}},{"id":"e0b1571f-290e-4f2d-9cae-59ba6c5b0427","name":"favColor","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const newTable = {"id":"df7e1268-b378-43f5-9954-6b9ecaf9a62a","name":"ElephantSeals","columns":[{"id":"3e0f91d5-6769-4b36-9412-f568741db545","name":"size","type":"text","options":{}},{"id":"0c6726c7-9775-451d-8c82-ef990b281a76","name":"favFood","type":"text","options":{}},{"id":"e0b1571f-290e-4f2d-9cae-59ba6c5b0427","name":"favColor","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const oldColumns = [{"id":"3e0f91d5-6769-4b36-9412-f568741db545","name":"size","type":"text","options":{}},{"id":"0c6726c7-9775-451d-8c82-ef990b281a76","name":"favFood","type":"text","options":{}},{"id":"e0b1571f-290e-4f2d-9cae-59ba6c5b0427","name":"favColor","type":"text","options":{}}];
      const newColumns = [{"id":"3e0f91d5-6769-4b36-9412-f568741db545","name":"size","type":"text","options":{}},{"id":"0c6726c7-9775-451d-8c82-ef990b281a76","name":"favFood","type":"text","options":{}},{"id":"e0b1571f-290e-4f2d-9cae-59ba6c5b0427","name":"favColor","type":"text","options":{}}];

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

      if (oldTable.name !== newTable.name) {
        await dao.renameTable(oldTable.name, newTable.name);
      }

      // sets the table meta to the old table
      await dao.updateTableMetaData({"id":"df7e1268-b378-43f5-9954-6b9ecaf9a62a","name":"ElephantSeals","columns":"[{\"id\":\"3e0f91d5-6769-4b36-9412-f568741db545\",\"name\":\"size\",\"type\":\"text\",\"options\":{}},{\"id\":\"0c6726c7-9775-451d-8c82-ef990b281a76\",\"name\":\"favFood\",\"type\":\"text\",\"options\":{}},{\"id\":\"e0b1571f-290e-4f2d-9cae-59ba6c5b0427\",\"name\":\"favColor\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"})
    }
   