
        import DAO from "../src/dao/dao.js";

        export async function up(knex) {
          const dao = new DAO("", knex);
          await dao.dropTable("Octopus");
          await dao.deleteTableMetaData("4285c313-d76b-4920-9f8f-f462aa521363");
        }

        export async function down(knex) {
          const dao = new DAO("", knex);
          await dao.createTable({"id":"4285c313-d76b-4920-9f8f-f462aa521363","name":"Octopus","columns":[{"id":"a88bb9bb-a477-44ea-bf86-8aa8b5613eb4","name":"size","type":"text","options":{}},{"id":"fa2ce99e-50fa-48d5-9a97-7f4a8e40595b","name":"favFood","type":"text","options":{}},{"id":"56e3e15f-759b-4ec6-997a-96b70501dd1b","name":"favColor","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"});
          await dao.addTableMetaData({"id":"4285c313-d76b-4920-9f8f-f462aa521363","name":"Octopus","columns":"[{\"id\":\"a88bb9bb-a477-44ea-bf86-8aa8b5613eb4\",\"name\":\"size\",\"type\":\"text\",\"options\":{}},{\"id\":\"fa2ce99e-50fa-48d5-9a97-7f4a8e40595b\",\"name\":\"favFood\",\"type\":\"text\",\"options\":{}},{\"id\":\"56e3e15f-759b-4ec6-997a-96b70501dd1b\",\"name\":\"favColor\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"})
        }
       