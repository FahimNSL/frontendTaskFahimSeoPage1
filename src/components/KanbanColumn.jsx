import TaskCard from './TaskCard';

export default function KanbanColumn({ title, color, tasks, count }) {
  return (
    <div className="flex-shrink-0 w-80 bg-gray-800 rounded-lg shadow-lg text-white">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <h2 className="font-semibold text-lg">{title}</h2>
          </div>
          <span className="text-gray-400">{count}</span>
        </div>
        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-700">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} title={title}/>
          ))}
        </div>
      </div>
    </div>
  );
}
