/**
      * @param { import("knex").Knex } knex
      * @returns { Promise<void> }
      */
      import DAO from "../src/dao/dao.js";

      export async function up(knex) {
        const dao = new DAO("", knex);

        await dao.dropTable("Sloth20");

        await dao.deleteTableMetaData("86b38250-8043-4586-bc01-5fa471c8eadc");
      }

      /**
       * @param { import("knex").Knex } knex
       * @returns { Promise<void> }
       */
      export async function down(knex) {
        const dao = new DAO("", knex);

        await dao.createTable({"id":"86b38250-8043-4586-bc01-5fa471c8eadc","name":"Sloth20","columns":[{"id":"20416472-a2c5-4248-ac04-3aeaa593d180","name":"size","type":"text","options":{}},{"id":"7e947cdb-2e7a-430c-9093-0d06cd37eb1d","name":"favFood","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"});

        await dao.addTableMetaData({"id":"86b38250-8043-4586-bc01-5fa471c8eadc","name":"Sloth20","columns":"[{\"id\":\"20416472-a2c5-4248-ac04-3aeaa593d180\",\"name\":\"size\",\"type\":\"text\",\"options\":{}},{\"id\":\"7e947cdb-2e7a-430c-9093-0d06cd37eb1d\",\"name\":\"favFood\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"})
      }
     