import {
  cleanQuery,
  isQuote,
  normalizeAndParse,
} from "./helpers/parser.helper";
import { ParsedQuery } from "../common/interfaces/parser.interface";
import { Quote, SingleQuote, DoubleQuote } from "./types/parser.type";

export class ParserService {
  constructor() {}

  parseMongoQuery(query: string): ParsedQuery {
    const cleaned = cleanQuery(query);
    const { collection, method, args } = this.getQueryParts(cleaned);
    const [filterStr, projectionStr] = this.getQueryArguments(args);
    const filter = normalizeAndParse(filterStr);
    const projection = projectionStr
      ? normalizeAndParse(projectionStr)
      : undefined;
    return { collection, filter, projection };
  }

  private getQueryParts(query: string): {
    collection: string;
    method: string;
    args: string;
  } {
    if (!query.startsWith("db.")) {
      throw new Error("Query must start with 'db.'");
    }

    const methodStart = query.indexOf("(");
    const methodEnd = query.lastIndexOf(")");
    if (methodStart === -1 || methodEnd === -1) {
      throw new Error("Invalid method format. Expected parentheses.");
    }

    const collectionAndMethod = query.slice(0, methodStart);
    const [_, collection, method] = collectionAndMethod.split(".");
    const args = query.slice(methodStart + 1, methodEnd).trim();

    if (!collection || !method) {
      throw new Error("Invalid query structure");
    }

    if (method !== "find") {
      throw new Error(
        `Unsupported method: '${method}'. Only 'find' is supported.`
      );
    }

    return { collection, method, args };
  }

  private getQueryArguments(input: string): [string, string?] {
    const splitIndex = this.getFilterLastIndex(input);
    if (splitIndex === -1) {
      throw new Error("The close brace of the filter object was not found");
    }

    const filter = input.slice(0, splitIndex).trim();
    const secondArgument = input.slice(splitIndex).trim();
    if (!secondArgument || !secondArgument.startsWith(",")) {
      return [filter];
    }

    const projection = secondArgument.slice(1).trim();
    return [filter, projection];
  }

  private getFilterLastIndex(str: string): number {
    let braceCount = 0;
    let inString: Quote | null = null;
    let escape = false;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      if (escape) {
        escape = false;
        continue;
      }

      if (char === "\\") {
        escape = true;
        continue;
      }

      if (isQuote(char)) {
        if (!inString || inString === char) {
          inString = this.toggleStringState(inString, char);
          continue;
        }
      }

      if (!inString) {
        if (char === "{") braceCount++;
        else if (char === "}") {
          braceCount--;
          if (braceCount === 0) return i + 1;
        }
      }
    }

    return -1;
  }

  private toggleStringState(current: Quote | null, next: string): Quote | null {
    if (current === next) return null;
    return next === SingleQuote || next === DoubleQuote ? next : null;
  }
}
