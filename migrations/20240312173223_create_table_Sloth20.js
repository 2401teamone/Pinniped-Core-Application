/**
      * @param { import("knex").Knex } knex
      * @returns { Promise<void> }
      */
      import DAO from "../src/dao/dao.js";

      export async function up(knex) {
        const dao = new DAO("", knex);

        await dao.createTable({"id":"a4c63040-1947-42d9-ba1f-aa273cdae243","name":"Sloth20","columns":[{"id":"fefc8e60-0ec7-4687-a6fd-a1a9ddd95f27","name":"size","type":"text","options":{}},{"id":"706bf43f-a23f-4b45-90d5-b0bf93049a21","name":"favFood","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"});

        await dao.addTableMetaData({"id":"a4c63040-1947-42d9-ba1f-aa273cdae243","name":"Sloth20","columns":"[{\"id\":\"fefc8e60-0ec7-4687-a6fd-a1a9ddd95f27\",\"name\":\"size\",\"type\":\"text\",\"options\":{}},{\"id\":\"706bf43f-a23f-4b45-90d5-b0bf93049a21\",\"name\":\"favFood\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"})
      }

      /**
       * @param { import("knex").Knex } knex
       * @returns { Promise<void> }
       */
      export async function down(knex) {
        const dao = new DAO("", knex);

        await dao.dropTable("Sloth20");

        await dao.deleteTableMetaData("a4c63040-1947-42d9-ba1f-aa273cdae243");
      }
     