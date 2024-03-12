/**
      * @param { import("knex").Knex } knex
      * @returns { Promise<void> }
      */
      import DAO from "../src/dao/dao.js";

      export async function up(knex) {
        const dao = new DAO("", knex);

        await dao.createTable({"id":"b4d5a934-140a-4bc7-9326-145c9638843c","name":"JoshTable","columns":[{"id":"59c5f51b-865b-4aaa-a2e3-d31457621739","name":"size","type":"text","options":{}},{"id":"f2498a1d-27e8-4bdf-8f95-89942b307770","name":"favFood","type":"text","options":{}},{"id":"f8eb46aa-a158-458a-bc4c-73a1cd9b0bfe","name":"favColor","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"});

        await dao.addTableMetaData({"id":"b4d5a934-140a-4bc7-9326-145c9638843c","name":"JoshTable","columns":"[{\"id\":\"59c5f51b-865b-4aaa-a2e3-d31457621739\",\"name\":\"size\",\"type\":\"text\",\"options\":{}},{\"id\":\"f2498a1d-27e8-4bdf-8f95-89942b307770\",\"name\":\"favFood\",\"type\":\"text\",\"options\":{}},{\"id\":\"f8eb46aa-a158-458a-bc4c-73a1cd9b0bfe\",\"name\":\"favColor\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"});
      }

      /**
       * @param { import("knex").Knex } knex
       * @returns { Promise<void> }
       */
      export async function down(knex) {
        const dao = new DAO("", knex);

        await dao.dropTable("JoshTable");

        await dao.deleteTableMetaData("b4d5a934-140a-4bc7-9326-145c9638843c");
      }
     