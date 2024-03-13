
    import DAO from "../src/dao/dao.js";

    export async function up(knex) {
      const oldTable = {"id":"fbe7f769-ceed-4dd7-a2fe-c27df65a2c57","name":"ElephantSealsUpdated","columns":[{"id":"e3b22347-699e-40dd-ae76-5849e77e3c55","name":"size","type":"text","options":{}},{"id":"9d622db1-9670-4651-8962-654907dce9e6","name":"favFood","type":"text","options":{}},{"id":"240e6677-6726-4440-9709-6c7f011ebb38","name":"favColor","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const newTable = {"id":"fbe7f769-ceed-4dd7-a2fe-c27df65a2c57","name":"ElephantSealsUpdated","columns":[{"id":"e3b22347-699e-40dd-ae76-5849e77e3c55","name":"size","type":"text","options":{}},{"id":"9d622db1-9670-4651-8962-654907dce9e6","name":"favFood","type":"text","options":{}},{"id":"240e6677-6726-4440-9709-6c7f011ebb38","name":"favColor","type":"text","options":{}},{"id":"e12af96e-ca8c-4d0d-9e17-fa147edc7e83","name":"favPerson","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const oldColumns = [{"id":"e3b22347-699e-40dd-ae76-5849e77e3c55","name":"size","type":"text","options":{}},{"id":"9d622db1-9670-4651-8962-654907dce9e6","name":"favFood","type":"text","options":{}},{"id":"240e6677-6726-4440-9709-6c7f011ebb38","name":"favColor","type":"text","options":{}}];
      const newColumns = [{"id":"e3b22347-699e-40dd-ae76-5849e77e3c55","name":"size","type":"text","options":{}},{"id":"9d622db1-9670-4651-8962-654907dce9e6","name":"favFood","type":"text","options":{}},{"id":"240e6677-6726-4440-9709-6c7f011ebb38","name":"favColor","type":"text","options":{}},{"id":"e12af96e-ca8c-4d0d-9e17-fa147edc7e83","name":"favPerson","type":"text","options":{}}];

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

      // Rename Table (Tested)
      if (oldTable.name !== newTable.name) {
        await dao.renameTable(oldTable.name, newTable.name);
      }

      // sets the table meta to the new table
      await dao.updateTableMetaData({"id":"fbe7f769-ceed-4dd7-a2fe-c27df65a2c57","name":"ElephantSealsUpdated","columns":"[{\"id\":\"e3b22347-699e-40dd-ae76-5849e77e3c55\",\"name\":\"size\",\"type\":\"text\",\"options\":{}},{\"id\":\"9d622db1-9670-4651-8962-654907dce9e6\",\"name\":\"favFood\",\"type\":\"text\",\"options\":{}},{\"id\":\"240e6677-6726-4440-9709-6c7f011ebb38\",\"name\":\"favColor\",\"type\":\"text\",\"options\":{}},{\"id\":\"e12af96e-ca8c-4d0d-9e17-fa147edc7e83\",\"name\":\"favPerson\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"})
    }

    export async function down(knex) {
      //Run the exact same logic as the up method, but with new and old variables
      //swapped..
      const oldTable = {"id":"fbe7f769-ceed-4dd7-a2fe-c27df65a2c57","name":"ElephantSealsUpdated","columns":[{"id":"e3b22347-699e-40dd-ae76-5849e77e3c55","name":"size","type":"text","options":{}},{"id":"9d622db1-9670-4651-8962-654907dce9e6","name":"favFood","type":"text","options":{}},{"id":"240e6677-6726-4440-9709-6c7f011ebb38","name":"favColor","type":"text","options":{}},{"id":"e12af96e-ca8c-4d0d-9e17-fa147edc7e83","name":"favPerson","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const newTable = {"id":"fbe7f769-ceed-4dd7-a2fe-c27df65a2c57","name":"ElephantSealsUpdated","columns":[{"id":"e3b22347-699e-40dd-ae76-5849e77e3c55","name":"size","type":"text","options":{}},{"id":"9d622db1-9670-4651-8962-654907dce9e6","name":"favFood","type":"text","options":{}},{"id":"240e6677-6726-4440-9709-6c7f011ebb38","name":"favColor","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"};
      const oldColumns = [{"id":"e3b22347-699e-40dd-ae76-5849e77e3c55","name":"size","type":"text","options":{}},{"id":"9d622db1-9670-4651-8962-654907dce9e6","name":"favFood","type":"text","options":{}},{"id":"240e6677-6726-4440-9709-6c7f011ebb38","name":"favColor","type":"text","options":{}},{"id":"e12af96e-ca8c-4d0d-9e17-fa147edc7e83","name":"favPerson","type":"text","options":{}}];
      const newColumns = [{"id":"e3b22347-699e-40dd-ae76-5849e77e3c55","name":"size","type":"text","options":{}},{"id":"9d622db1-9670-4651-8962-654907dce9e6","name":"favFood","type":"text","options":{}},{"id":"240e6677-6726-4440-9709-6c7f011ebb38","name":"favColor","type":"text","options":{}}];

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
      await dao.updateTableMetaData({"id":"fbe7f769-ceed-4dd7-a2fe-c27df65a2c57","name":"ElephantSealsUpdated","columns":"[{\"id\":\"e3b22347-699e-40dd-ae76-5849e77e3c55\",\"name\":\"size\",\"type\":\"text\",\"options\":{}},{\"id\":\"9d622db1-9670-4651-8962-654907dce9e6\",\"name\":\"favFood\",\"type\":\"text\",\"options\":{}},{\"id\":\"240e6677-6726-4440-9709-6c7f011ebb38\",\"name\":\"favColor\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"})
    }
   