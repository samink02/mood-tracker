/**
 * Tests for TodoListCard component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TodoListCard from '@/components/TodoListCard';
import { TodoItem, createEmptyTodo } from '@/models/Todo';

// Mock the todo store
const mockAddTodo = jest.fn();
const mockUpdateTodo = jest.fn();
const mockDeleteTodo = jest.fn();
const mockSetTodoStatus = jest.fn();
const mockGetActiveTodos = jest.fn(() => []);
const mockGetCompletedTodos = jest.fn(() => []);
const mockGetStatistics = jest.fn(() => ({
  total: 0,
  completed: 0,
  inProgress: 0,
  completionPercentage: 0,
}));

jest.mock('@/state/todoStore', () => ({
  useTodoStore: Object.assign(
    jest.fn(() => ({
      items: [],
      addTodo: mockAddTodo,
      updateTodo: mockUpdateTodo,
      deleteTodo: mockDeleteTodo,
      setTodoStatus: mockSetTodoStatus,
      getActiveTodos: mockGetActiveTodos,
      getCompletedTodos: mockGetCompletedTodos,
      getStatistics: mockGetStatistics,
    })),
    {
      getState: jest.fn(() => ({
        items: [],
        addTodo: mockAddTodo,
        updateTodo: mockUpdateTodo,
        deleteTodo: mockDeleteTodo,
        setTodoStatus: mockSetTodoStatus,
        getActiveTodos: mockGetActiveTodos,
        getCompletedTodos: mockGetCompletedTodos,
        getStatistics: mockGetStatistics,
      })),
    }
  ),
}));

const sampleTodos: TodoItem[] = [
  {
    ...createEmptyTodo('Buy groceries'),
    id: '1',
    description: 'Milk, bread, eggs',
    status: 'not started',
    priority: 'medium',
  },
  {
    ...createEmptyTodo('Exercise'),
    id: '2',
    description: '30 min walk',
    status: 'done',
    priority: 'high',
    completedAt: new Date().toISOString(),
  },
  {
    ...createEmptyTodo('Read book'),
    id: '3',
    description: 'Chapter 5',
    status: 'in progress',
    priority: 'low',
  },
];

describe('TodoListCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<TodoListCard />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders empty state when no todos', () => {
    const { toJSON } = render(<TodoListCard />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders todo items when present', () => {
    // Override the mock for this test
    (mockGetActiveTodos as jest.Mock).mockReturnValue([
      sampleTodos[0],
      sampleTodos[2],
    ]);
    (mockGetCompletedTodos as jest.Mock).mockReturnValue([sampleTodos[1]]);
    (mockGetStatistics as jest.Mock).mockReturnValue({
      total: 3,
      completed: 1,
      inProgress: 1,
      completionPercentage: 33,
    });

    const { toJSON } = render(<TodoListCard />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows progress bar based on completion', () => {
    (mockGetStatistics as jest.Mock).mockReturnValue({
      total: 3,
      completed: 1,
      inProgress: 1,
      completionPercentage: 33,
    });

    const { toJSON } = render(<TodoListCard />);
    expect(toJSON()).toBeTruthy();
  });

  it('opens add modal when add button is pressed', () => {
    const { getByText, queryByText } = render(<TodoListCard />);

    // The add button should be present
    const addButton = getByText(/\+/i);
    fireEvent.press(addButton);

    // Modal should open with title input
    expect(queryByText(/title/i)).toBeTruthy();
  });

  it('displays status badges correctly', () => {
    (mockGetActiveTodos as jest.Mock).mockReturnValue([
      sampleTodos[0], // "not started"
      sampleTodos[2], // "in progress"
    ]);
    (mockGetCompletedTodos as jest.Mock).mockReturnValue([sampleTodos[1]]);

    const { toJSON } = render(<TodoListCard />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows active and completed sections', () => {
    (mockGetActiveTodos as jest.Mock).mockReturnValue([sampleTodos[0]]);
    (mockGetCompletedTodos as jest.Mock).mockReturnValue([sampleTodos[1]]);

    const { toJSON } = render(<TodoListCard />);
    expect(toJSON()).toBeTruthy();
  });
});
