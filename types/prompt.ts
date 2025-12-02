import type {
  Prompt,
  PromptVersion,
  Context,
  Execution,
  Evaluation,
  PromptCategory,
} from "@prisma/client";

/**
 * Prompt with current version and related data
 */
export interface PromptWithVersion extends Prompt {
  currentVersion: PromptVersion | null;
}

/**
 * Prompt with all relations
 */
export interface PromptWithRelations extends Prompt {
  currentVersion: PromptVersion | null;
  contexts: Context[];
  author: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
  _count: {
    versions: number;
    executions: number;
    evaluations: number;
  };
}

/**
 * Prompt list item (for display in grid/list)
 */
export interface PromptListItem extends Prompt {
  currentVersion: {
    id: string;
    version: number;
    content: string;
    variables: unknown;
  } | null;
  _count: {
    contexts: number;
    executions: number;
  };
}

/**
 * Variable extracted from prompt content
 */
export interface PromptVariable {
  name: string;
  defaultValue?: string;
  description?: string;
}

/**
 * Prompt filter options
 */
export interface PromptFilters {
  filter?: "all" | "favorites" | "recent" | "archived";
  category?: PromptCategory;
  tags?: string[];
  search?: string;
}

/**
 * Prompt sort options
 */
export interface PromptSort {
  field: "usage" | "created" | "updated" | "title";
  direction: "asc" | "desc";
}

/**
 * Version comparison result
 */
export interface VersionDiff {
  type: "addition" | "deletion" | "modification" | "unchanged";
  content: string;
  lineNumber: {
    old?: number;
    new?: number;
  };
}
