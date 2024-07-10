import "dotenv/config";
import mysql from "mysql2/promise";
import { IUser } from "./user.model";
import { MySqlQueryGenerator } from "./mysql-query-generator";
import { NumberOperator, StringOperator } from "./types";

function consoleDir(param: any) {
  console.dir(param, {
    showHidden: false,
    depth: null,
    colors: true,
  });
}

/**
 * Function to execute a SQL query and print the result
 */
async function runQuery(
  connection: mysql.PoolConnection,
  label: string,
  sql: string
) {
  try {
    console.log(`---${label.toUpperCase()} RESULT---`);
    const [result] = await connection.query(sql);
    consoleDir(result);
    console.log("\n\n");
  } catch (err) {
    consoleDir(err);
  }
}

/**
 * Main function to run the sequence of queries
 */
async function main() {
  try {
    const pool = mysql.createPool(process.env.DATABASE_URL!);
    const connection = await pool.getConnection();
    const tableName = "`users`";

    // Select query
    await runQuery(
      connection,
      "select",
      MySqlQueryGenerator.generateSelectSql<Partial<IUser>>(
        tableName,
        ["name", "age"],
        {
          name: {
            op: "STARTS_WITH" as StringOperator,
            value: "Krish",
          },
        },
        0,
        5
      )
    );
    await runQuery(
      connection,
      "count",
      MySqlQueryGenerator.generateCountSql<Partial<IUser>>(tableName, {})
    );

    // Insert query
    await runQuery(
      connection,
      "insert",
      MySqlQueryGenerator.generateInsertSql<IUser>(tableName, {
        name: "Tejas",
        age: 21,
        phone: "9123456789",
        address: "Mangalore, Karnataka",
      })
    );
    await runQuery(
      connection,
      "select",
      MySqlQueryGenerator.generateSelectSql<IUser>(
        tableName,
        ["name", "phone", "age"],
        {},
        0,
        5
      )
    );
    await runQuery(
      connection,
      "count",
      MySqlQueryGenerator.generateCountSql<IUser>(tableName)
    );

    // Update query
    await runQuery(
      connection,
      "update",
      MySqlQueryGenerator.generateUpdateSql<IUser>(
        tableName,
        { name: "Tejas Prabhu", address: "Mangalore, DK, Karnataka" },
        { phone: { op: "EQUALS", value: "9123456789" } }
      )
    );
    await runQuery(
      connection,
      "select",
      MySqlQueryGenerator.generateSelectSql<IUser>(tableName, [], {}, 0, 5)
    );
    await runQuery(
      connection,
      "count",
      MySqlQueryGenerator.generateCountSql<IUser>(tableName)
    );

    // Delete query
    await runQuery(
      connection,
      "delete",
      MySqlQueryGenerator.generateDeleteSql<IUser>(tableName, {
        OR: [
          {
            name: {
              op: "STARTS_WITH" as StringOperator,
              value: "Tej",
            },
          },
          {
            age: {
              op: "EQUALS" as NumberOperator,
              value: 21,
            },
          },
        ],
      })
    );
    await runQuery(
      connection,
      "select",
      MySqlQueryGenerator.generateSelectSql<IUser>(tableName, [], {}, 0, 5)
    );
    await runQuery(
      connection,
      "count",
      MySqlQueryGenerator.generateCountSql<IUser>(tableName)
    );

    connection.release();
    pool.end();
  } catch (err) {
    consoleDir(err);
  }
}

main();
