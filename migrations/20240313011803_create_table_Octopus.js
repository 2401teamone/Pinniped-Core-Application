
      import DAO from "../src/dao/dao.js";

      export async function up(knex) {
        const dao = new DAO("", knex);
        await dao.createTable({"id":"61d53b67-b47d-41af-800d-26e45af4c135","name":"Octopus","columns":[{"id":"308044e9-fe4b-4c4c-a957-0bf94065b43d","name":"size","type":"text","options":{}},{"id":"bbc0522c-e13c-4c53-8b34-47804ce9af76","name":"favFood","type":"text","options":{}},{"id":"b0708d98-6e4a-4fc3-89cb-25ab44b59b00","name":"favColor","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"});
        await dao.addTableMetaData({"id":"61d53b67-b47d-41af-800d-26e45af4c135","name":"Octopus","columns":"[{\"id\":\"308044e9-fe4b-4c4c-a957-0bf94065b43d\",\"name\":\"size\",\"type\":\"text\",\"options\":{}},{\"id\":\"bbc0522c-e13c-4c53-8b34-47804ce9af76\",\"name\":\"favFood\",\"type\":\"text\",\"options\":{}},{\"id\":\"b0708d98-6e4a-4fc3-89cb-25ab44b59b00\",\"name\":\"favColor\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"});
      }


      export async function down(knex) {
        const dao = new DAO("", knex);
        await dao.dropTable("Octopus");
        await dao.deleteTableMetaData("61d53b67-b47d-41af-800d-26e45af4c135");
      }
     