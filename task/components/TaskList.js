function TaskList({ tasks, onUpdateTask, onDeleteTask, onAddTask }) {
  try {
    const [filter, setFilter] = React.useState('all');

    const filteredTasks = tasks.filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    });

    return (
      <div data-name="task-list" data-file="components/TaskList.js">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Управление задачами</h2>
        
        {onAddTask && <AddTaskForm onAddTask={onAddTask} />}
        
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Все задачи
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Активные
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Завершенные
          </button>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="icon-clipboard-list text-6xl text-gray-300 mb-4"></div>
            <h3 className="text-xl font-medium text-[var(--text-secondary)] mb-2">Нет задач</h3>
            <p className="text-[var(--text-secondary)]">Добавьте свою первую задачу выше</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('TaskList component error:', error);
    return null;
  }
}