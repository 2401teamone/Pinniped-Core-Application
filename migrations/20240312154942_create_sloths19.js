/**
    * @param { import("knex").Knex } knex
    * @returns { Promise<void> }
    */
    import DAO from "../src/dao/dao.js";

    export async function up(knex) {
      const dao = new DAO("", knex);

      await dao.createTable({"id":"8756e511-ea06-4947-b295-9bbe9a78e4a1","name":"sloths19","columns":[{"id":"e776fbf9-b95a-4ba6-9d37-9a43b554d13d","name":"size","type":"text","options":{}},{"id":"1fbc1516-2ead-4210-9813-1423f153543a","name":"favFood","type":"text","options":{}}],"getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"});

      await dao.addTableMetaData({"id":"8756e511-ea06-4947-b295-9bbe9a78e4a1","name":"sloths19","columns":"[{\"id\":\"e776fbf9-b95a-4ba6-9d37-9a43b554d13d\",\"name\":\"size\",\"type\":\"text\",\"options\":{}},{\"id\":\"1fbc1516-2ead-4210-9813-1423f153543a\",\"name\":\"favFood\",\"type\":\"text\",\"options\":{}}]","getAllRule":"user","getOneRule":"public","createRule":"public","deleteRule":"admin","updateRule":"public"})
    }

    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
    export async function down(knex) {
      const dao = new DAO("", knex);

      await dao.dropTable("sloths19");

      await dao.deleteTableMetaData("8756e511-ea06-4947-b295-9bbe9a78e4a1");
    }
   