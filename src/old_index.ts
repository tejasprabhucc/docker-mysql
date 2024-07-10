import "dotenv/config";
import mysql from "mysql2/promise";
import { IUser } from "./user.model";
import { MySqlQueryGenerator } from "./mysql-query-generator";

function consoleDir(param: any) {
  console.dir(param, {
    showHidden: false,
    depth: null,
    colors: true,
  });
}

/**
 * Function to pretty print objects to the console
 */
const getSelectSql = (
  tableName: string,
  conditions?: { [key: string]: string | number },
  ...params: string[]
): string => {
  const columns = params.length ? params.join(", ") : "*";
  let whereClause: string = "";
  if (conditions) {
    const conditionKeys = Object.keys(conditions);
    const condition = conditionKeys
      .map((key) =>
        typeof conditions[key] === "string"
          ? `${key} = '${conditions[key]}'`
          : `${key} = ${conditions[key]}`
      )
      .join(" AND ");
    whereClause = `WHERE ${condition}`;
  }
  return `
    SELECT ${columns} FROM ${tableName} ${whereClause}
  `;
};

/**
 * Function to generate a COUNT SQL query
 */
const getCountSql = (tableName: string): string => {
  return `
    SELECT COUNT(*) AS \`count\` FROM ${tableName}
    `;
};

/**
 * Function to generate an INSERT SQL query
 */
const getInsertSql = (tableName: string, params: IUser): string => {
  const columns = Object.keys(params).join(",");
  const values = Object.values(params)
    .map((value) => `'${value}'`)
    .join(", ");

  return `
    INSERT INTO ${tableName} (
        ${columns}
    ) VALUES (
        ${values}
    )
    `;
};

/**
 * Function to generate an UPDATE SQL query
 */
const getUpdateSql = (
  tableName: string,
  updates: { [key: string]: string | number },
  conditions: { [key: string]: string | number }
): string => {
  const updateKeys = Object.keys(updates);
  const updateClause = updateKeys
    .map((key) =>
      typeof updates[key] === "string"
        ? `${key} = '${updates[key]}'`
        : `${key} = ${updates[key]}`
    )
    .join(", ");

  const conditionKeys = Object.keys(conditions);
  const condition = conditionKeys
    .map((key) =>
      typeof conditions[key] === "string"
        ? `${key} = '${conditions[key]}'`
        : `${key} = ${conditions[key]}`
    )
    .join(" AND ");
  return `
    UPDATE ${tableName} SET ${updateClause} WHERE ${condition};
  `;
};

/**
 * Function to generate a DELETE SQL query
 */
const getDeleteSql = (
  tableName: string,
  params: { [key: string]: string | number }
): string => {
  const keys = Object.keys(params);
  const condition = keys
    .map((key) => `${key} = '${params[key]}'`)
    .join(" AND ");
  return `
    DELETE FROM ${tableName} WHERE ${condition}
    `;
};

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
