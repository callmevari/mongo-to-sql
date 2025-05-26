import { SingleQuote, DoubleQuote } from "../types/parser.type";

export function cleanQuery(str: string): string {
  return str.trim().replace(/;$/, "");
}

export function isQuote(char: string) {
  return char === DoubleQuote || char === SingleQuote;
}

export function normalizeAndParse(input: string): Record<string, any> {
  const normalized = input
    .replace(/([{\[,]\s*)([a-zA-Z0-9_$]+)(\s*:)/g, '$1"$2"$3')
    .replace(/'([^']*?)'/g, (_, val) => `"${val}"`);
  try {
    return JSON.parse(normalized);
  } catch {
    throw new Error(`Invalid JSON format in: ${input}`);
  }
}
