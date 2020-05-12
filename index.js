#!/usr/bin/env node

// https://www.youtube.com/watch?v=pldDuqnPP1s
const mariadb = require("mariadb");
const consola = require("consola");
const express = require("express");
const bodyParser = require("body-parser");

const dbSettings = {
  host: "rikardo-db",
  user: "rikardo",
  password: "passw0rd",
  database: "rikardo_todo",
  connectionLimit: 5,
  connectTimeout: 5000,
};

const serverSettings = {
  host: "0.0.0.0",
  port: 9001,
};

async function getDbConn() {
  return await mariadb.createConnection(dbSettings);
}

async function queryDb(sql, args) {
  let conn;
  try {
    conn = await getDbConn();

    const result = await conn.query(sql, args);

    conn.end();

    return result;
  } catch (e) {
    if (conn) {
      conn.end();
    }

    throw e;
  }
}

async function testDatabaseConnection() {
  consola.info("|> Spajam se na MariaDB server... ");
  let conn;
  let success = false;
  try {
    const query = await queryDb("SELECT 1 as val");

    success = true;
    consola.success("Uspjeh!");
  } catch (err) {
    consola.error(String(err));
  } finally {
    if (conn) {
      conn.end();
    }

    return success;
  }
}

async function startApp() {
  const app = express();
  app.set("view engine", "ejs");
  app.use(bodyParser.urlencoded({ extended: true }));

  await queryDb(
    "create table if not exists `ricardo_todo` (`id` int unsigned not null auto_increment, `description` text not null, `done` tinyint(1) not null, primary key (`id`) )"
  );

  app.get("/", async (req, res) => {
    const tasks = [...(await queryDb("select * from `ricardo_todo`"))];
    res.render("index", { tasks });
  });

  app.post("/task", async (req, res) => {
    const { description } = req.body || {};

    if (description) {
      await queryDb(
        "insert into `ricardo_todo` (description, done) values (?, 0)",
        [description]
      );
    }

    res.redirect("/");
  });

  app.post("/task/complete", async (req, res) => {
    const { id } = req.body || {};

    if (id) {
      await queryDb("update `ricardo_todo` set done = ? where id = ?", [1, id]);
    }

    res.redirect("/");
  });

  app.post("/task/uncomplete", async (req, res) => {
    const { id } = req.body || {};

    if (id) {
      await queryDb("update `ricardo_todo` set done = ? where id = ?", [0, id]);
    }

    res.redirect("/");
  });

  app.post("/task/delete", async (req, res) => {
    const { id } = req.body || {};

    if (id) {
      await queryDb("delete from `ricardo_todo` where id = ?", [id]);
    }

    res.redirect("/");
  });

  app.listen(serverSettings.port, serverSettings.host, () => {
    consola.info(
      `Aplikacija je spremna i vrti se na http://${serverSettings.host}:${serverSettings.port}`
    );
  });
}

testDatabaseConnection().then((success) => {
  if (!success) {
    consola.warn("Prvo je potrebno osposobiti pristup bazi!");
    process.exit(1);
  }

  startApp();
});
