/**
 * TodoListCard Component
 * Displays and manages to-do items with status badges and rollover behavior
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { TodoItem, TodoStatus, getTodoStatusInfo } from '@/models/Todo';
import { useTodoStore } from '@/state/todoStore';

const STATUS_OPTIONS: TodoStatus[] = ['not started', 'in progress', 'ongoing', 'on hold', 'done'];

const TodoListCard: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<TodoStatus>('not started');
  const [error, setError] = useState<string | null>(null);

  const items = useTodoStore((state) => state.items);
  const addTodo = useTodoStore((state) => state.addTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const setTodoStatus = useTodoStore((state) => state.setTodoStatus);
  const getStatistics = useTodoStore((state) => state.getStatistics);

  const statistics = getStatistics();

  const openAddModal = () => {
    setEditingTodo(null);
    setTitle('');
    setDescription('');
    setSelectedStatus('not started');
    setError(null);
    setModalVisible(true);
  };

  const openEditModal = (todo: TodoItem) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description || '');
    setSelectedStatus(todo.status);
    setError(null);
    setModalVisible(true);
  };

  const saveTodo = () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (editingTodo) {
      updateTodo(editingTodo.id, {
        title,
        description: description || undefined,
        status: selectedStatus,
      });
    } else {
      addTodo(title, description || undefined);
    }

    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    deleteTodo(id);
  };

  const handleStatusChange = (id: string, status: TodoStatus) => {
    setTodoStatus(id, status);
  };

  const renderStatusBadge = (status: TodoStatus) => {
    const statusInfo = getTodoStatusInfo(status);
    return (
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: statusInfo.backgroundColor },
        ]}
      >
        <Text style={[styles.statusText, { color: statusInfo.color }]}>
          {statusInfo.label}
        </Text>
      </View>
    );
  };

  const activeTodos = items.filter((t) => t.status !== 'done');
  const completedTodos = items.filter((t) => t.status === 'done');

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>✅ To-Do List</Text>
        <Pressable style={styles.addButton} onPress={openAddModal} accessibilityRole="button" accessibilityLabel="Add to-do">
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      {/* Progress Bar */}
      {items.length > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${statistics.completionPercentage}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {statistics.completionPercentage}% complete
          </Text>
        </View>
      )}

      {items.length === 0 ? (
        <Text style={styles.emptyText}>No to-dos yet. Add one to get started!</Text>
      ) : (
        <ScrollView style={styles.todoList} nestedScrollEnabled>
          {activeTodos.map((todo) => (
            <Pressable
              key={todo.id}
              style={styles.todoItem}
              onPress={() => openEditModal(todo)}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${todo.title}`}
            >
              <View style={styles.todoInfo}>
                <Text style={styles.todoTitle}>{todo.title}</Text>
                {todo.description ? (
                  <Text style={styles.todoDescription} numberOfLines={1}>
                    {todo.description}
                  </Text>
                ) : null}
                {renderStatusBadge(todo.status)}
              </View>
              <View style={styles.todoActions}>
                {todo.status !== 'done' && (
                  <Pressable
                    style={styles.doneButton}
                    onPress={() => handleStatusChange(todo.id, 'done')}
                    accessibilityRole="button"
                    accessibilityLabel={`Mark ${todo.title} as done`}
                  >
                    <Text style={styles.doneButtonText}>✓</Text>
                  </Pressable>
                )}
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(todo.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${todo.title}`}
                >
                  <Text style={styles.deleteButtonText}>×</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}

          {completedTodos.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>Completed</Text>
              {completedTodos.map((todo) => (
                <Pressable
                  key={todo.id}
                  style={[styles.todoItem, styles.completedTodoItem]}
                  onPress={() => openEditModal(todo)}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${todo.title}`}
                >
                  <View style={styles.todoInfo}>
                    <Text style={[styles.todoTitle, styles.completedTodoTitle]}>
                      {todo.title}
                    </Text>
                    {renderStatusBadge(todo.status)}
                  </View>
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => handleDelete(todo.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${todo.title}`}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </Pressable>
                </Pressable>
              ))}
            </>
          )}
        </ScrollView>
      )}

      {/* To-Do Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTodo ? 'Edit To-Do' : 'Add To-Do'}
            </Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="What do you need to do?"
                placeholderTextColor={colors.text.tertiary}
                accessibilityLabel="To-do title"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Description (optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textInputMultiline]}
                value={description}
                onChangeText={setDescription}
                placeholder="Add details..."
                placeholderTextColor={colors.text.tertiary}
                multiline
                numberOfLines={3}
                accessibilityLabel="To-do description"
              />
            </View>

            {editingTodo && (
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Status</Text>
                <View style={styles.statusOptions}>
                  {STATUS_OPTIONS.map((status) => {
                    const statusInfo = getTodoStatusInfo(status);
                    const isSelected = selectedStatus === status;
                    return (
                      <Pressable
                        key={status}
                        style={[
                          styles.statusOption,
                          { backgroundColor: statusInfo.backgroundColor },
                          isSelected && { borderColor: statusInfo.color, borderWidth: 2 },
                        ]}
                        onPress={() => setSelectedStatus(status)}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: isSelected }}
                      >
                        <Text style={[styles.statusOptionText, { color: statusInfo.color }]}>
                          {statusInfo.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveTodo}
              >
                <Text style={styles.saveButtonText}>
                  {editingTodo ? 'Update' : 'Add'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card.background,
    borderRadius: spacing.cardBorderRadius,
    padding: spacing.cardPadding,
    shadowColor: colors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: spacing.cardElevation,
    marginVertical: spacing.cardMargin / 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.heading4,
    color: colors.text.primary,
  },
  addButton: {
    backgroundColor: colors.primary[500],
    borderRadius: spacing.buttonBorderRadius,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  addButtonText: {
    ...typography.body2,
    color: colors.button.primaryText,
    fontWeight: typography.fontWeightSemibold,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background.input,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.status.success,
    borderRadius: 3,
  },
  progressText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  emptyText: {
    ...typography.body2,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  todoList: {
    maxHeight: 250,
  },
  sectionHeader: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeightSemibold,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  completedTodoItem: {
    opacity: 0.6,
  },
  todoInfo: {
    flex: 1,
  },
  todoTitle: {
    ...typography.body2,
    color: colors.text.primary,
    fontWeight: typography.fontWeightMedium,
    marginBottom: spacing.xs / 2,
  },
  completedTodoTitle: {
    textDecorationLine: 'line-through',
    color: colors.text.tertiary,
  },
  todoDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs / 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.badgePaddingHorizontal,
    paddingVertical: spacing.badgePaddingVertical / 2,
    borderRadius: spacing.badgeBorderRadius,
    alignSelf: 'flex-start',
  },
  statusText: {
    ...typography.caption,
    fontWeight: typography.fontWeightMedium,
  },
  todoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  doneButton: {
    backgroundColor: colors.status.successLight,
    borderRadius: spacing.buttonBorderRadius,
    padding: spacing.xs,
    minWidth: 30,
    alignItems: 'center',
  },
  doneButtonText: {
    ...typography.body1,
    color: colors.status.success,
    fontWeight: typography.fontWeightBold,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  deleteButtonText: {
    fontSize: 20,
    color: colors.status.error,
    fontWeight: typography.fontWeightBold,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.background.modal,
    borderRadius: spacing.modalBorderRadius,
    padding: spacing.modalPadding,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  modalTitle: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  errorText: {
    ...typography.body2,
    color: colors.status.error,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: spacing.inputMarginBottom,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.input.border,
    borderRadius: spacing.inputBorderRadius,
    padding: spacing.inputPadding,
    backgroundColor: colors.input.background,
    ...typography.body2,
    color: colors.text.primary,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.buttonBorderRadius,
    borderWidth: 1,
    borderColor: colors.card.transparent,
  },
  statusOptionText: {
    ...typography.caption,
    fontWeight: typography.fontWeightMedium,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  modalButton: {
    borderRadius: spacing.buttonBorderRadius,
    paddingVertical: spacing.buttonPadding,
    paddingHorizontal: spacing.xl,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.button.secondary,
    borderWidth: 1,
    borderColor: colors.button.secondaryBorder,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.button.secondaryText,
  },
  saveButton: {
    backgroundColor: colors.button.primary,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.button.primaryText,
  },
});

export default TodoListCard;