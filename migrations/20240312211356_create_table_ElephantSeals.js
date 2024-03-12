/**
      * @param { import("knex").Knex } knex
      * @returns { Promise<void> }
      */
      import DAO from "../src/dao/dao.js";

      export async function up(knex) {
        const dao = new DAO("", knex);

        await dao.createTable({"id":"df7e1268-b378-43f5-9954-6b9ecaf9a62a","name":"ElephantSeals","columns":[{"id":"3e0f91d5-6769-4b36-9412-f568741db545","name":"size","type":"text","options":{}},{"id":"0c6726c7-9775-451d-8c82-ef990b281a76","name":"favFood","type":"text","options":{}},{"id":"e0b1571f-290e-4f2d-9cae-59ba6c5b0427","name":"favColor","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"});

        await dao.addTableMetaData({"id":"df7e1268-b378-43f5-9954-6b9ecaf9a62a","name":"ElephantSeals","columns":"[{\"id\":\"3e0f91d5-6769-4b36-9412-f568741db545\",\"name\":\"size\",\"type\":\"text\",\"options\":{}},{\"id\":\"0c6726c7-9775-451d-8c82-ef990b281a76\",\"name\":\"favFood\",\"type\":\"text\",\"options\":{}},{\"id\":\"e0b1571f-290e-4f2d-9cae-59ba6c5b0427\",\"name\":\"favColor\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"});
      }

      /**
       * @param { import("knex").Knex } knex
       * @returns { Promise<void> }
       */
      export async function down(knex) {
        const dao = new DAO("", knex);

        await dao.dropTable("ElephantSeals");

        await dao.deleteTableMetaData("df7e1268-b378-43f5-9954-6b9ecaf9a62a");
      }
     