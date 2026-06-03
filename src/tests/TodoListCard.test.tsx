/**
 * Tests for TodoListCard component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TodoListCard from '@/components/TodoListCard';
import { TodoItem, TodoStatus, createEmptyTodo } from '@/models/Todo';

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
    },
  ),
}));

const sampleTodos: TodoItem[] = [
  {
    ...createEmptyTodo(),
    id: '1',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs',
    status: 'not started',
    priority: 'medium',
  },
  {
    ...createEmptyTodo(),
    id: '2',
    title: 'Exercise',
    description: '30 min walk',
    status: 'done',
    priority: 'high',
    completedAt: new Date().toISOString(),
  },
  {
    ...createEmptyTodo(),
    id: '3',
    title: 'Read book',
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
    const { getByText } = render(<TodoListCard />);
    expect(getByText(/to-do/i)).toBeTruthy();
  });

  it('renders empty state when no todos', () => {
    const { getByText } = render(<TodoListCard />);
    expect(getByText(/no.*to.do/i)).toBeTruthy();
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

    const { getByText } = render(<TodoListCard />);
    expect(getByText('Buy groceries')).toBeTruthy();
    expect(getByText('Exercise')).toBeTruthy();
    expect(getByText('Read book')).toBeTruthy();
  });

  it('shows progress bar based on completion', () => {
    (mockGetStatistics as jest.Mock).mockReturnValue({
      total: 3,
      completed: 1,
      inProgress: 1,
      completionPercentage: 33,
    });

    const { getByText } = render(<TodoListCard />);
    expect(getByText(/33%/)).toBeTruthy();
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

    const { getByText } = render(<TodoListCard />);
    expect(getByText(/not started/i)).toBeTruthy();
    expect(getByText(/in progress/i)).toBeTruthy();
    expect(getByText(/done/i)).toBeTruthy();
  });

  it('shows active and completed sections', () => {
    (mockGetActiveTodos as jest.Mock).mockReturnValue([sampleTodos[0]]);
    (mockGetCompletedTodos as jest.Mock).mockReturnValue([sampleTodos[1]]);

    const { getByText } = render(<TodoListCard />);
    expect(getByText(/active/i)).toBeTruthy();
    expect(getByText(/completed/i)).toBeTruthy();
  });
});
