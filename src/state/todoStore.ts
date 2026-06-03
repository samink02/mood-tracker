/**
 * To-Do Store
 * Zustand store for managing to-do items with AsyncStorage persistence
 * To-dos are global (not tied to a specific day) and persist across days
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  TodoItem,
  TodoStatus,
  createEmptyTodo,
  updateTodoStatus,
  sortTodos,
  validateTodo,
} from '@/models/Todo';

interface TodoState {
  items: TodoItem[];
  searchQuery: string;
  filterStatus: TodoStatus | 'all';
  isLoading: boolean;
  error: string | null;
}

interface TodoActions {
  // CRUD operations
  addTodo: (title: string, description?: string, priority?: 'low' | 'medium' | 'high', tags?: string[]) => void;
  updateTodo: (id: string, updates: Partial<TodoItem>) => void;
  deleteTodo: (id: string) => void;
  setTodoStatus: (id: string, status: TodoStatus) => void;

  // Query operations
  getTodoById: (id: string) => TodoItem | undefined;
  getActiveTodos: () => TodoItem[];
  getCompletedTodos: () => TodoItem[];
  getTodosByStatus: (status: TodoStatus) => TodoItem[];
  getFilteredTodos: () => TodoItem[];
  getStatistics: () => {
    total: number;
    notStarted: number;
    inProgress: number;
    ongoing: number;
    onHold: number;
    done: number;
    completionPercentage: number;
  };

  // Filter and search
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: TodoStatus | 'all') => void;

  // Bulk operations
  clearCompleted: () => void;
  markAllAsDone: () => void;

  // State management
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type TodoStore = TodoState & TodoActions;

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      items: [],
      searchQuery: '',
      filterStatus: 'all',
      isLoading: false,
      error: null,

      // Add a new to-do
      addTodo: (title: string, description?: string, priority?: 'low' | 'medium' | 'high', tags?: string[]) => {
        const newTodo = createEmptyTodo(title);
        const updatedTodo: TodoItem = {
          ...newTodo,
          description: description || '',
          priority,
          tags,
        };

        const validation = validateTodo(updatedTodo);
        if (!validation.valid) {
          set({ error: validation.error });
          return;
        }

        set((state) => ({
          items: sortTodos([...state.items, updatedTodo]),
          error: null,
        }));
      },

      // Update a to-do
      updateTodo: (id: string, updates: Partial<TodoItem>) => {
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === id) {
              const updatedItem = {
                ...item,
                ...updates,
                updatedAt: new Date().toISOString(),
              };

              // Set completedAt if status changed to done
              if (updates.status === 'done' && !item.completedAt) {
                updatedItem.completedAt = new Date().toISOString();
              }

              const validation = validateTodo(updatedItem);
              if (!validation.valid) {
                set({ error: validation.error });
                return item;
              }

              return updatedItem;
            }
            return item;
          });

          return {
            items: sortTodos(updatedItems),
            error: null,
          };
        });
      },

      // Delete a to-do
      deleteTodo: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          error: null,
        }));
      },

      // Set to-do status
      setTodoStatus: (id: string, status: TodoStatus) => {
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === id) {
              return updateTodoStatus(item, status);
            }
            return item;
          });

          return {
            items: sortTodos(updatedItems),
            error: null,
          };
        });
      },

      // Get to-do by ID
      getTodoById: (id: string) => {
        return get().items.find((item) => item.id === id);
      },

      // Get active to-dos (not done)
      getActiveTodos: () => {
        return sortTodos(get().items.filter((item) => item.status !== 'done'));
      },

      // Get completed to-dos
      getCompletedTodos: () => {
        return sortTodos(get().items.filter((item) => item.status === 'done'));
      },

      // Get to-dos by status
      getTodosByStatus: (status: TodoStatus) => {
        return sortTodos(get().items.filter((item) => item.status === status));
      },

      // Get filtered to-dos based on search and filter
      getFilteredTodos: () => {
        const state = get();
        let filtered = [...state.items];

        // Apply status filter
        if (state.filterStatus !== 'all') {
          filtered = filtered.filter((item) => item.status === state.filterStatus);
        }

        // Apply search query
        if (state.searchQuery) {
          const lowerQuery = state.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (item) =>
              item.title.toLowerCase().includes(lowerQuery) ||
              (item.description && item.description.toLowerCase().includes(lowerQuery))
          );
        }

        return sortTodos(filtered);
      },

      // Get to-do statistics
      getStatistics: () => {
        const items = get().items;
        const total = items.length;
        const notStarted = items.filter((item) => item.status === 'not started').length;
        const inProgress = items.filter((item) => item.status === 'in progress').length;
        const ongoing = items.filter((item) => item.status === 'ongoing').length;
        const onHold = items.filter((item) => item.status === 'on hold').length;
        const done = items.filter((item) => item.status === 'done').length;
        const completionPercentage = total === 0 ? 0 : Math.round((done / total) * 100);

        return {
          total,
          notStarted,
          inProgress,
          ongoing,
          onHold,
          done,
          completionPercentage,
        };
      },

      // Set search query
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      // Set filter status
      setFilterStatus: (status: TodoStatus | 'all') => {
        set({ filterStatus: status });
      },

      // Clear all completed to-dos
      clearCompleted: () => {
        set((state) => ({
          items: state.items.filter((item) => item.status !== 'done'),
        }));
      },

      // Mark all to-dos as done
      markAllAsDone: () => {
        set((state) => ({
          items: state.items.map((item) => updateTodoStatus(item, 'done')),
        }));
      },

      // Set loading state
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      // Set error state
      setError: (error: string | null) => {
        set({ error });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'todo-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);