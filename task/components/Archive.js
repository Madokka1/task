function Archive({ tasks }) {
  try {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortBy, setSortBy] = React.useState('completedAt');

    const filteredTasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (sortBy === 'completedAt') {
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      } else if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'high': return 'text-red-600 bg-red-100';
        case 'medium': return 'text-yellow-600 bg-yellow-100';
        case 'low': return 'text-green-600 bg-green-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    const getPriorityText = (priority) => {
      switch (priority) {
        case 'high': return 'Высокий';
        case 'medium': return 'Средний';
        case 'low': return 'Низкий';
        default: return 'Средний';
      }
    };

    return (
      <div data-name="archive" data-file="components/Archive.js">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Архив задач</h2>
        
        <div className="task-card mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field flex-1"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-48"
            >
              <option value="completedAt">По дате завершения</option>
              <option value="createdAt">По дате создания</option>
              <option value="title">По названию</option>
            </select>
          </div>
          
          <p className="text-sm text-[var(--text-secondary)]">
            Найдено: {sortedTasks.length} из {tasks.length} завершенных задач
          </p>
        </div>

        {sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="icon-archive text-6xl text-gray-300 mb-4"></div>
            <h3 className="text-xl font-medium text-[var(--text-secondary)] mb-2">
              {tasks.length === 0 ? 'Архив пуст' : 'Ничего не найдено'}
            </h3>
            <p className="text-[var(--text-secondary)]">
              {tasks.length === 0 
                ? 'Завершенные задачи появятся здесь' 
                : 'Попробуйте изменить поисковый запрос'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTasks.map(task => (
              <div key={task.id} className="task-card opacity-75">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded bg-[var(--accent-color)] flex items-center justify-center">
                    <div className="icon-check text-xs text-white"></div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-1 line-through text-gray-500">
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className="text-sm mb-3 line-through text-gray-400">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs">
                      <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {getPriorityText(task.priority)}
                      </span>
                      
                      <span className="text-[var(--text-secondary)]">
                        Создано: {formatDate(task.createdAt)}
                      </span>
                      
                      <span className="text-[var(--text-secondary)]">
                        Завершено: {formatDate(task.updatedAt || task.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Archive component error:', error);
    return null;
  }
}
