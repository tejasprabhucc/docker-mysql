import { describe, test, expect } from "vitest";
import { MySqlQueryGenerator } from "./mysql-query-generator";
import { WhereExpression } from "./types";
import { IUser } from "./user.model";

describe("MySqlQueryGenerator", () => {
  test("should generate a INSERT SQL statement", () => {
    const tableName = "users";
    const row: IUser = {
      name: "Tejas",
      age: 21,
      phone: "9123456789",
      address: "Mangalore, Karnataka",
    };
    const expectedSql = `INSERT INTO users (\`name\`, \`age\`, \`phone\`, \`address\`) VALUES ("Tejas", 21, "9123456789", "Mangalore, Karnataka")`;

    const sql = MySqlQueryGenerator.generateInsertSql<IUser>(tableName, row);
    expect(sql.trim()).toBe(expectedSql);
  });

  test("should generate a UPDATE SQL statement", () => {
    const tableName = "users";
    const row: Partial<IUser> = {
      name: "Tejas Prabhu",
      address: "Mangalore, DK, Karnataka",
    };
    const where: WhereExpression<IUser> = {
      phone: { op: "EQUALS", value: "9123456789" },
    };
    const expectedSql = `UPDATE users SET \`name\` = "Tejas Prabhu", \`address\` = "Mangalore, DK, Karnataka" WHERE \`phone\` = "9123456789"`;

    const sql = MySqlQueryGenerator.generateUpdateSql(tableName, row, where);
    expect(sql.trim()).toBe(expectedSql);
  });

  test("should generate a DELETE SQL statement", () => {
    const tableName = "users";
    const where: WhereExpression<IUser> = {
      name: { op: "EQUALS", value: "Tejas" },
      phone: { op: "EQUALS", value: "9123456789" },
    };
    const expectedSql = `DELETE FROM users WHERE \`name\` = "Tejas" AND \`phone\` = "9123456789"`;

    const sql = MySqlQueryGenerator.generateDeleteSql(tableName, where);
    expect(sql.trim()).toBe(expectedSql);
  });

  test("should generate a SELECT SQL statement", () => {
    const tableName = "users";
    const fieldsToSelect: Array<keyof Partial<IUser>> = ["name", "age"];
    const where: WhereExpression<IUser> = {};
    const offset = 0;
    const limit = 5;
    const expectedSql = `SELECT name, age FROM users LIMIT 5 OFFSET 0`;

    const sql = MySqlQueryGenerator.generateSelectSql<IUser>(
      tableName,
      fieldsToSelect,
      where,
      offset,
      limit
    );
    expect(sql.trim()).toBe(expectedSql);
  });

  test("should generate a COUNT SQL statement", () => {
    const tableName = "users";
    const where: WhereExpression<IUser> = {};
    const expectedSql = `SELECT COUNT(*) AS \`count\` FROM users`;

    const sql = MySqlQueryGenerator.generateCountSql<IUser>(tableName, where);
    expect(sql.trim()).toBe(expectedSql);
  });

  test("should return the WHERE clause for conditions supplied as params", () => {
    const conditions = [
      {
        name: { op: "EQUALS", value: "Tejas" },
        phone: { op: "EQUALS", value: "9123456789" },
      },
      {
        age: { op: "GREATER_THAN", value: "15" },
      },
    ];
  });
});
