export interface ParsedQuery {
  collection: string;
  filter: Record<string, any>;
  projection?: Record<string, any>;
}
