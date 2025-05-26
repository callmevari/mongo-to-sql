export function buildFilterCondition(filter: any): string {
  if (Array.isArray(filter)) {
    throw new Error("Top-level filter should be an object, not an array.");
  }

  const conditions: string[] = [];

  for (const [key, value] of Object.entries(filter)) {
    if (key === "$and") {
      if (!Array.isArray(value)) throw new Error("$and must be an array");
      const andConditions = value.map((v) => `(${buildFilterCondition(v)})`);
      conditions.push(andConditions.join(" AND "));
    } else if (key === "$or") {
      if (!Array.isArray(value)) throw new Error("$or must be an array");
      const orConditions = value.map((v) => `(${buildFilterCondition(v)})`);
      conditions.push(orConditions.join(" OR "));
    } else {
      conditions.push(buildCondition(key, value));
    }
  }

  return conditions.join(" AND ");
}

function buildCondition(field: string, condition: any): string {
  if (
    typeof condition !== "object" ||
    condition === null ||
    Array.isArray(condition)
  ) {
    return `${field} = ${formatValue(condition)}`;
  }

  const parts: string[] = [];

  for (const [op, val] of Object.entries(condition)) {
    switch (op) {
      case "$eq":
        parts.push(`${field} = ${formatValue(val)}`);
        break;
      case "$ne":
        parts.push(`${field} != ${formatValue(val)}`);
        break;
      case "$gt":
        parts.push(`${field} > ${formatValue(val)}`);
        break;
      case "$gte":
        parts.push(`${field} >= ${formatValue(val)}`);
        break;
      case "$lt":
        parts.push(`${field} < ${formatValue(val)}`);
        break;
      case "$lte":
        parts.push(`${field} <= ${formatValue(val)}`);
        break;
      case "$in":
        if (!Array.isArray(val)) throw new Error("$in requires an array");
        const inValues = val.map((v) => formatValue(v)).join(", ");
        parts.push(`${field} IN (${inValues})`);
        break;
      default:
        throw new Error(`Unsupported operator: ${op}`);
    }
  }

  return parts.join(" AND ");
}

export function formatValue(value: any): string {
  if (typeof value === "string") {
    const escaped = value.replace(/'/g, "''");
    return `'${escaped}'`;
  }
  if (typeof value === "boolean" || typeof value === "number") {
    return `${value}`;
  }
  if (value === null) {
    return "NULL";
  }

  throw new Error(`Unsupported value type: ${value}`);
}
