import { useState } from 'react';
import KanbanColumn from './KanbanColumn';

const initialColumns = [
  { id: 1, title: 'Incomplete', color: 'bg-red-500', tasks: [] },
  { id: 2, title: 'To Do', color: 'bg-blue-500', tasks: [] },
  { id: 3, title: 'Doing', color: 'bg-yellow-500', tasks: [] },
  { id: 4, title: 'Under Review', color: 'bg-purple-500', tasks: [] },
  { id: 5, title: 'Completed', color: 'bg-green-500', tasks: [] },
  { id: 6, title: 'Overdue', color: 'bg-orange-500', tasks: [] },
];

// Generate mock tasks with status (Completed, Overdue, etc.)
const mockTasks = Array(30).fill().map((_, index) => ({
  id: index + 1,
  clientName: 'Client Name',
  assignee: 'Fahim',
  description: 'Lorem ipsum dolor sit amet consectetur...',
  progress: '1/2',
  date: '30-12-2022',
  comments: 15,
  attachments: 25,
  members: 12,
  status: 
    index % 6 === 0 ? 'Completed' : 
    index % 6 === 1 ? 'Overdue' : 
    index % 6 === 2 ? 'To Do' : 
    index % 6 === 3 ? 'Doing' : 
    index % 6 === 4 ? 'Under Review' : 'Incomplete', // Randomly assign status to tasks
}));

// Distribute tasks among columns based on their status
const distributeTasksToColumns = (columns, tasks) => {
  // Create an object to map task statuses to columns
  const taskGroups = columns.reduce((acc, column) => {
    acc[column.title] = []; // Initialize each column's task array
    return acc;
  }, {});

  // Distribute tasks into columns based on their status
  tasks.forEach(task => {
    if (taskGroups[task.status]) {
      taskGroups[task.status].push(task); // Add task to the correct column group
    }
  });

  // Return the columns with tasks distributed according to their status
  return columns.map(column => ({
    ...column,
    tasks: taskGroups[column.title] || [], // Ensure each column gets its respective tasks
  }));
};

export default function KanbanBoard() {
  const [columns] = useState(distributeTasksToColumns(initialColumns, mockTasks));

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <div className="flex overflow-x-auto gap-4 pb-4">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            color={column.color}
            tasks={column.tasks}
            count={column.tasks.length}
          />
        ))}
      </div>
    </div>
  );
}
