/**
 * To-Do List Data Models
 * TypeScript interfaces for to-do items
 */

// To-do item status types
export type TodoStatus = 'not started' | 'in progress' | 'ongoing' | 'on hold' | 'done';

/**
 * To-do item interface
 * To-dos are global and persist across days, with rollover behavior
 */
export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp (optional)
  priority?: 'low' | 'medium' | 'high'; // Optional priority level
  tags?: string[]; // Optional tags for categorization
}

// Helper function to create a new to-do item
export const createEmptyTodo = (title: string): TodoItem => {
  const now = new Date().toISOString();
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    title,
    description: '',
    status: 'not started',
    createdAt: now,
    updatedAt: now,
  };
};

// Helper to get status display information
export const getTodoStatusInfo = (status: TodoStatus) => {
  switch (status) {
    case 'not started':
      return { label: 'Not Started', color: '#9E9E9E', backgroundColor: '#EEEEEE' };
    case 'in progress':
      return { label: 'In Progress', color: '#2196F3', backgroundColor: '#E3F2FD' };
    case 'ongoing':
      return { label: 'Ongoing', color: '#FF9800', backgroundColor: '#FFF3E0' };
    case 'on hold':
      return { label: 'On Hold', color: '#F44336', backgroundColor: '#FFEBEE' };
    case 'done':
      return { label: 'Done', color: '#4CAF50', backgroundColor: '#E8F5E9' };
    default:
      return { label: 'Unknown', color: '#9E9E9E', backgroundColor: '#EEEEEE' };
  }
};

// Helper to get priority display information
export const getTodoPriorityInfo = (priority?: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'high':
      return { label: 'High', color: '#F44336', order: 3 };
    case 'medium':
      return { label: 'Medium', color: '#FF9800', order: 2 };
    case 'low':
      return { label: 'Low', color: '#4CAF50', order: 1 };
    default:
      return { label: 'None', color: '#9E9E9E', order: 0 };
  }
};

// Helper to update status and update timestamp
export const updateTodoStatus = (todo: TodoItem, newStatus: TodoStatus): TodoItem => {
  const now = new Date().toISOString();
  const updatedTodo = {
    ...todo,
    status: newStatus,
    updatedAt: now,
  };

  // Set completedAt timestamp if status is 'done'
  if (newStatus === 'done' && !todo.completedAt) {
    updatedTodo.completedAt = now;
  }

  return updatedTodo;
};

// Helper to sort to-dos by priority and status
export const sortTodos = (todos: TodoItem[]): TodoItem[] => {
  return [...todos].sort((a, b) => {
    // Sort by priority first
    const priorityOrderA = getTodoPriorityInfo(a.priority)?.order || 0;
    const priorityOrderB = getTodoPriorityInfo(b.priority)?.order || 0;
    if (priorityOrderA !== priorityOrderB) {
      return priorityOrderB - priorityOrderA; // Higher priority first
    }

    // Then by status (not started -> in progress -> ongoing -> on hold -> done)
    const statusOrder: Record<TodoStatus, number> = {
      'not started': 0,
      'in progress': 1,
      'ongoing': 2,
      'on hold': 3,
      'done': 4,
    };
    const statusOrderA = statusOrder[a.status];
    const statusOrderB = statusOrder[b.status];
    if (statusOrderA !== statusOrderB) {
      return statusOrderA - statusOrderB;
    }

    // Finally by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

// Helper to filter to-dos by status
export const filterTodosByStatus = (todos: TodoItem[], status: TodoStatus): TodoItem[] => {
  return todos.filter((todo) => todo.status === status);
};

// Helper to get all active to-dos (not done)
export const getActiveTodos = (todos: TodoItem[]): TodoItem[] => {
  return todos.filter((todo) => todo.status !== 'done');
};

// Helper to get completed to-dos
export const getCompletedTodos = (todos: TodoItem[]): TodoItem[] => {
  return todos.filter((todo) => todo.status === 'done');
};

// Helper to search to-dos by title or description
export const searchTodos = (todos: TodoItem[], query: string): TodoItem[] => {
  const lowerQuery = query.toLowerCase();
  return todos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(lowerQuery) ||
      (todo.description && todo.description.toLowerCase().includes(lowerQuery))
  );
};

// Helper to filter to-dos by tags
export const filterTodosByTag = (todos: TodoItem[], tag: string): TodoItem[] => {
  return todos.filter((todo) => todo.tags && todo.tags.includes(tag));
};

// Helper to get all unique tags from to-dos
export const getAllTags = (todos: TodoItem[]): string[] => {
  const tagsSet = new Set<string>();
  todos.forEach((todo) => {
    if (todo.tags) {
      todo.tags.forEach((tag) => tagsSet.add(tag));
    }
  });
  return Array.from(tagsSet).sort();
};

// Helper to validate to-do item
export const validateTodo = (todo: TodoItem): { valid: boolean; error?: string } => {
  if (!todo.title || todo.title.trim() === '') {
    return { valid: false, error: 'Title is required' };
  }

  if (todo.title.length > 200) {
    return { valid: false, error: 'Title must be less than 200 characters' };
  }

  if (todo.description && todo.description.length > 1000) {
    return { valid: false, error: 'Description must be less than 1000 characters' };
  }

  const validStatuses: TodoStatus[] = ['not started', 'in progress', 'ongoing', 'on hold', 'done'];
  if (!validStatuses.includes(todo.status)) {
    return { valid: false, error: 'Invalid status' };
  }

  return { valid: true };
};

// Helper to calculate to-do completion percentage
export const calculateCompletionPercentage = (todos: TodoItem[]): number => {
  if (todos.length === 0) return 0;
  const completedCount = todos.filter((todo) => todo.status === 'done').length;
  return Math.round((completedCount / todos.length) * 100);
};

// Helper to get to-do statistics
export const getTodoStatistics = (todos: TodoItem[]) => {
  return {
    total: todos.length,
    notStarted: todos.filter((todo) => todo.status === 'not started').length,
    inProgress: todos.filter((todo) => todo.status === 'in progress').length,
    ongoing: todos.filter((todo) => todo.status === 'ongoing').length,
    onHold: todos.filter((todo) => todo.status === 'on hold').length,
    done: todos.filter((todo) => todo.status === 'done').length,
    completionPercentage: calculateCompletionPercentage(todos),
  };
};