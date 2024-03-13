
      import DAO from "../src/dao/dao.js";

      export async function up(knex) {
        const dao = new DAO("", knex);
        await dao.createTable({"id":"8657b606-1666-4dcb-b8c1-a9e6077283b3","name":"Octopus","columns":[{"id":"2501e0a5-a7f3-4db9-82cb-6eb54b26763b","name":"size","type":"text","options":{"minLength":0,"maxLength":255}}],"getAllRule":"public","getOneRule":"public","createRule":"public","deleteRule":"public","updateRule":"public"});
        await dao.addTableMetaData({"id":"8657b606-1666-4dcb-b8c1-a9e6077283b3","name":"Octopus","columns":"[{\"id\":\"2501e0a5-a7f3-4db9-82cb-6eb54b26763b\",\"name\":\"size\",\"type\":\"text\",\"options\":{\"minLength\":0,\"maxLength\":255}}]","getAllRule":"public","getOneRule":"public","createRule":"public","deleteRule":"public","updateRule":"public"});
      }

      export async function down(knex) {
        const dao = new DAO("", knex);
        await dao.dropTable("Octopus");
        await dao.deleteTableMetaData("8657b606-1666-4dcb-b8c1-a9e6077283b3");
      }
     