
        import DAO from "../src/dao/dao.js";

        export async function up(knex) {
          const dao = new DAO("", knex);
          await dao.dropTable("Octopus");
          await dao.deleteTableMetaData("8657b606-1666-4dcb-b8c1-a9e6077283b3");
        }

        export async function down(knex) {
          const dao = new DAO("", knex);
          await dao.createTable({"id":"8657b606-1666-4dcb-b8c1-a9e6077283b3","name":"Octopus","columns":[{"id":"d69eba78-b88c-4e19-992f-4d16589908dd","name":"name","type":"text","options":{"minLength":5,"maxLength":255}}],"getAllRule":"admin","getOneRule":"public","createRule":"public","deleteRule":"public","updateRule":"public"});
          await dao.addTableMetaData({"id":"8657b606-1666-4dcb-b8c1-a9e6077283b3","name":"Octopus","columns":"[{\"id\":\"d69eba78-b88c-4e19-992f-4d16589908dd\",\"name\":\"name\",\"type\":\"text\",\"options\":{\"minLength\":5,\"maxLength\":255}}]","getAllRule":"admin","getOneRule":"public","createRule":"public","deleteRule":"public","updateRule":"public"})
        }
       