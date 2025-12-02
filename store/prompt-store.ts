import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { PromptListItem, PromptFilters, PromptSort } from "@/types";

interface PromptState {
  // Selected prompt
  selectedPromptId: string | null;

  // Filters and sorting
  filters: PromptFilters;
  sort: PromptSort;

  // UI state
  isDetailPanelOpen: boolean;
  selectedPromptIds: Set<string>;

  // Actions
  setSelectedPrompt: (id: string | null) => void;
  setFilters: (filters: Partial<PromptFilters>) => void;
  setSort: (sort: PromptSort) => void;
  toggleDetailPanel: (open?: boolean) => void;
  togglePromptSelection: (id: string) => void;
  selectAllPrompts: (ids: string[]) => void;
  clearSelection: () => void;
  resetFilters: () => void;
}

const defaultFilters: PromptFilters = {
  filter: "all",
  category: undefined,
  tags: undefined,
  search: undefined,
};

const defaultSort: PromptSort = {
  field: "updated",
  direction: "desc",
};

export const usePromptStore = create<PromptState>()(
  immer((set) => ({
    // Initial state
    selectedPromptId: null,
    filters: defaultFilters,
    sort: defaultSort,
    isDetailPanelOpen: false,
    selectedPromptIds: new Set(),

    // Actions
    setSelectedPrompt: (id) =>
      set((state) => {
        state.selectedPromptId = id;
        state.isDetailPanelOpen = id !== null;
      }),

    setFilters: (filters) =>
      set((state) => {
        state.filters = { ...state.filters, ...filters };
      }),

    setSort: (sort) =>
      set((state) => {
        state.sort = sort;
      }),

    toggleDetailPanel: (open) =>
      set((state) => {
        state.isDetailPanelOpen = open ?? !state.isDetailPanelOpen;
      }),

    togglePromptSelection: (id) =>
      set((state) => {
        if (state.selectedPromptIds.has(id)) {
          state.selectedPromptIds.delete(id);
        } else {
          state.selectedPromptIds.add(id);
        }
      }),

    selectAllPrompts: (ids) =>
      set((state) => {
        state.selectedPromptIds = new Set(ids);
      }),

    clearSelection: () =>
      set((state) => {
        state.selectedPromptIds = new Set();
      }),

    resetFilters: () =>
      set((state) => {
        state.filters = defaultFilters;
        state.sort = defaultSort;
      }),
  }))
);
