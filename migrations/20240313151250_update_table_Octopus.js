
    import DAO from "../src/dao/dao.js";

    export async function up(knex) {
      const oldTable = {"id":"7464f1e2-2da9-42fa-8644-854fa179ffbb","name":"Octopus","columns":[{"id":"fdc30fc7-10fd-48e0-abdc-fd6562f63ec1","name":"size","type":"text","options":{"minLength":0,"maxLength":255}}],"getAllRule":"public","getOneRule":"public","createRule":"public","deleteRule":"public","updateRule":"public"};
      const newTable = {"id":"7464f1e2-2da9-42fa-8644-854fa179ffbb","name":"NewOctopus","columns":[{"id":"fdc30fc7-10fd-48e0-abdc-fd6562f63ec1","name":"size","type":"text","options":{"minLength":0,"maxLength":255}}],"getAllRule":"public","getOneRule":"public","createRule":"public","deleteRule":"public","updateRule":"public"};
      const oldColumns = [{"id":"fdc30fc7-10fd-48e0-abdc-fd6562f63ec1","name":"size","type":"text","options":{"minLength":0,"maxLength":255}}];
      const newColumns = [{"id":"fdc30fc7-10fd-48e0-abdc-fd6562f63ec1","name":"size","type":"text","options":{"minLength":0,"maxLength":255}}];

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
      await dao.updateTableMetaData({"id":"7464f1e2-2da9-42fa-8644-854fa179ffbb","name":"NewOctopus","columns":"[{\"id\":\"fdc30fc7-10fd-48e0-abdc-fd6562f63ec1\",\"name\":\"size\",\"type\":\"text\",\"options\":{\"minLength\":0,\"maxLength\":255}}]","getAllRule":"public","getOneRule":"public","createRule":"public","deleteRule":"public","updateRule":"public"})
    }

    export async function down(knex) {
      //Run the exact same logic as the up method, but with new and old variables
      //swapped..
      const oldTable = {"id":"7464f1e2-2da9-42fa-8644-854fa179ffbb","name":"NewOctopus","columns":[{"id":"fdc30fc7-10fd-48e0-abdc-fd6562f63ec1","name":"size","type":"text","options":{"minLength":0,"maxLength":255}}],"getAllRule":"public","getOneRule":"public","createRule":"public","deleteRule":"public","updateRule":"public"};
      const newTable = {"id":"7464f1e2-2da9-42fa-8644-854fa179ffbb","name":"Octopus","columns":[{"id":"fdc30fc7-10fd-48e0-abdc-fd6562f63ec1","name":"size","type":"text","options":{"minLength":0,"maxLength":255}}],"getAllRule":"public","getOneRule":"public","createRule":"public","deleteRule":"public","updateRule":"public"};
      const oldColumns = [{"id":"fdc30fc7-10fd-48e0-abdc-fd6562f63ec1","name":"size","type":"text","options":{"minLength":0,"maxLength":255}}];
      const newColumns = [{"id":"fdc30fc7-10fd-48e0-abdc-fd6562f63ec1","name":"size","type":"text","options":{"minLength":0,"maxLength":255}}];

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
      await dao.updateTableMetaData({"id":"7464f1e2-2da9-42fa-8644-854fa179ffbb","name":"Octopus","columns":"[{\"id\":\"fdc30fc7-10fd-48e0-abdc-fd6562f63ec1\",\"name\":\"size\",\"type\":\"text\",\"options\":{\"minLength\":0,\"maxLength\":255}}]","getAllRule":"public","getOneRule":"public","createRule":"public","deleteRule":"public","updateRule":"public"})
    }
   