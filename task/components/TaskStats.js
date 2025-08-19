function TaskStats({ tasks }) {
  try {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const priorityStats = tasks.reduce((acc, task) => {
      if (!task.completed) {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
      }
      return acc;
    }, {});

    const overdueTasks = tasks.filter(task => {
      if (task.completed || !task.dueDate) return false;
      return new Date(task.dueDate) < new Date();
    }).length;

    return (
      <div className="space-y-6" data-name="task-stats" data-file="components/TaskStats.js">
        <div className="task-card">
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Статистика</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Всего задач</span>
              <span className="font-semibold text-[var(--text-primary)]">{totalTasks}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Завершено</span>
              <span className="font-semibold text-[var(--accent-color)]">{completedTasks}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Активных</span>
              <span className="font-semibold text-[var(--primary-color)]">{pendingTasks}</span>
            </div>

            {overdueTasks > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Просрочено</span>
                <span className="font-semibold text-[var(--danger-color)]">{overdueTasks}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[var(--text-secondary)]">Прогресс</span>
              <span className="font-semibold text-[var(--text-primary)]">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[var(--accent-color)] h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {pendingTasks > 0 && (
          <div className="task-card">
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">По приоритетам</h3>
            
            <div className="space-y-3">
              {priorityStats.high > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-red-600 flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    Высокий
                  </span>
                  <span className="font-semibold">{priorityStats.high}</span>
                </div>
              )}
              
              {priorityStats.medium > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    Средний
                  </span>
                  <span className="font-semibold">{priorityStats.medium}</span>
                </div>
              )}
              
              {priorityStats.low > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-green-600 flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    Низкий
                  </span>
                  <span className="font-semibold">{priorityStats.low}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('TaskStats component error:', error);
    return null;
  }
}