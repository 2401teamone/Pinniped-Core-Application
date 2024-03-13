
      import DAO from "../src/dao/dao.js";

      export async function up(knex) {
        const dao = new DAO("", knex);
        await dao.createTable({"id":"7464f1e2-2da9-42fa-8644-854fa179ffbb","name":"Octopus","columns":[{"id":"fdc30fc7-10fd-48e0-abdc-fd6562f63ec1","name":"size","type":"text","options":{"minLength":0,"maxLength":255}}],"getAllRule":"public","getOneRule":"public","createRule":"public","deleteRule":"public","updateRule":"public"});
        await dao.addTableMetaData({"id":"7464f1e2-2da9-42fa-8644-854fa179ffbb","name":"Octopus","columns":"[{\"id\":\"fdc30fc7-10fd-48e0-abdc-fd6562f63ec1\",\"name\":\"size\",\"type\":\"text\",\"options\":{\"minLength\":0,\"maxLength\":255}}]","getAllRule":"public","getOneRule":"public","createRule":"public","deleteRule":"public","updateRule":"public"});
      }

      export async function down(knex) {
        const dao = new DAO("", knex);
        await dao.dropTable("Octopus");
        await dao.deleteTableMetaData("7464f1e2-2da9-42fa-8644-854fa179ffbb");
      }
     