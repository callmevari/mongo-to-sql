import { ParsedQuery } from "../common/interfaces/parser.interface";
import { buildFilterCondition } from "./helpers/builder.helper";

export class BuilderService {
  constructor() {}

  buildSQLQuery(input: ParsedQuery): string {
    const { collection, filter, projection } = input;

    const selectClause = this.buildSelectClause(projection);
    const fromClause = `FROM ${collection}`;
    const whereClause = this.buildWhereClause(filter);

    return [selectClause, fromClause, whereClause].filter(Boolean).join(" ");
  }

  private buildSelectClause(projection?: Record<string, any>): string {
    if (!projection || Object.keys(projection).length === 0) {
      return "SELECT *";
    }

    const fields = Object.keys(projection)
      .filter((key) => projection[key])
      .join(", ");

    return `SELECT ${fields}`;
  }

  private buildWhereClause(filter: Record<string, any>): string {
    if (!filter || Object.keys(filter).length === 0) {
      return "";
    }

    const condition = buildFilterCondition(filter);
    return condition ? `WHERE ${condition}` : "";
  }
}
