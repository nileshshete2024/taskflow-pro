import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { useState, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useFilteredTasks } from '../../hooks/useTasks';
import { STATUSES } from '../../utils/helpers';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from '../Task/TaskCard';
import type { Task, TaskStatus } from '../../types';

interface Props {
  projectId: string;
  onTaskClick: (task: Task) => void;
}

export const KanbanBoard = ({ projectId, onTaskClick }: Props) => {
  const { moveTask, reorderTasks } = useAppStore();
  const tasksByStatus = useFilteredTasks(projectId);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const allTasks = Object.values(tasksByStatus).flat();
      const task = allTasks.find((t) => t.id === active.id);
      if (task) setActiveTask(task);
    },
    [tasksByStatus]
  );

  const handleDragOver = useCallback(
    ({ active, over }: DragOverEvent) => {
      if (!over) return;
      const activeId = String(active.id);
      const overId = String(over.id);
      if (activeId === overId) return;

      const overColumn = STATUSES.includes(overId as TaskStatus);
      if (overColumn) {
        moveTask(activeId, overId as TaskStatus);
        return;
      }

      const allTasks = Object.values(tasksByStatus).flat();
      const overTask = allTasks.find((t) => t.id === overId);
      if (!overTask) return;

      const activeTaskItem = allTasks.find((t) => t.id === activeId);
      if (!activeTaskItem) return;

      if (activeTaskItem.status !== overTask.status) {
        moveTask(activeId, overTask.status);
      }
    },
    [tasksByStatus, moveTask]
  );

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveTask(null);
      if (!over) return;
      const activeId = String(active.id);
      const overId = String(over.id);
      if (activeId === overId) return;

      const allTasks = Object.values(tasksByStatus).flat();
      const overTask = allTasks.find((t) => t.id === overId);
      if (!overTask) return;
      const activeTaskItem = allTasks.find((t) => t.id === activeId);
      if (!activeTaskItem) return;

      if (activeTaskItem.status === overTask.status) {
        reorderTasks(activeId, overId, activeTaskItem.status);
      }
    },
    [tasksByStatus, reorderTasks]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-6 h-full min-w-max">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-2 opacity-90 shadow-2xl">
            <TaskCard task={activeTask} onTaskClick={() => {}} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
