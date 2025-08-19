function KanbanBoard({ tasks, onUpdateTask, onAddTask }) {
  try {
    const [draggedTask, setDraggedTask] = React.useState(null);
    const [newTaskColumn, setNewTaskColumn] = React.useState(null);
    const [newTaskTitle, setNewTaskTitle] = React.useState('');

    const columns = [
      { id: 'todo', title: 'К выполнению', status: 'pending' },
      { id: 'approval', title: 'На согласовании', status: 'approval' },
      { id: 'progress', title: 'В процессе', status: 'in-progress' },
      { id: 'done', title: 'Выполнено', status: 'completed' }
    ];

    const getTasksByStatus = (status) => {
      if (status === 'pending') return tasks.filter(t => !t.completed && !t.inProgress && !t.approval);
      if (status === 'approval') return tasks.filter(t => t.approval && !t.completed && !t.inProgress);
      if (status === 'in-progress') return tasks.filter(t => t.inProgress && !t.completed);
      if (status === 'completed') return tasks.filter(t => t.completed);
      return [];
    };

    const moveTask = (taskId, newStatus) => {
      const updates = {};
      if (newStatus === 'pending') {
        updates.inProgress = false;
        updates.completed = false;
        updates.approval = false;
      } else if (newStatus === 'approval') {
        updates.approval = true;
        updates.inProgress = false;
        updates.completed = false;
      } else if (newStatus === 'in-progress') {
        updates.inProgress = true;
        updates.completed = false;
        updates.approval = false;
      } else if (newStatus === 'completed') {
        updates.inProgress = false;
        updates.completed = true;
        updates.approval = false;
      }
      onUpdateTask(taskId, updates);
    };

    const handleDragStart = (e, task) => {
      setDraggedTask(task);
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, columnStatus) => {
      e.preventDefault();
      if (draggedTask) {
        moveTask(draggedTask.id, columnStatus);
        setDraggedTask(null);
      }
    };

    const addQuickTask = (columnStatus) => {
      if (!newTaskTitle.trim()) return;
      
      const taskData = {
        title: newTaskTitle.trim(),
        description: '',
        priority: 'medium'
      };

      onAddTask(taskData);
      
      setTimeout(() => {
        const newTask = tasks[0];
        if (newTask && columnStatus !== 'pending') {
          moveTask(newTask.id, columnStatus);
        }
      }, 100);

      setNewTaskTitle('');
      setNewTaskColumn(null);
    };

    return (
      <div data-name="kanban-board" data-file="components/KanbanBoard.js">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Канбан доска</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map(column => (
            <div 
              key={column.id} 
              className="bg-white rounded-lg p-4 shadow-sm min-h-96"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  {column.title}
                  <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">
                    {getTasksByStatus(column.status).length}
                  </span>
                </h3>
                <button
                  onClick={() => setNewTaskColumn(column.status)}
                  className="text-gray-400 hover:text-[var(--primary-color)] transition-colors"
                >
                  <div className="icon-plus text-lg"></div>
                </button>
              </div>
              
              {newTaskColumn === column.status && (
                <div className="mb-3 p-3 border-2 border-dashed border-[var(--primary-color)] rounded">
                  <input
                    type="text"
                    placeholder="Название задачи"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="input-field text-sm mb-2"
                    onKeyPress={(e) => e.key === 'Enter' && addQuickTask(column.status)}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => addQuickTask(column.status)}
                      className="btn-success text-xs"
                    >
                      Добавить
                    </button>
                    <button
                      onClick={() => {setNewTaskColumn(null); setNewTaskTitle('');}}
                      className="btn-secondary text-xs"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {getTasksByStatus(column.status).map(task => (
                  <div 
                    key={task.id} 
                    className="bg-gray-50 p-3 rounded border cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <h4 className="font-medium text-sm mb-2">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-[var(--text-secondary)] mb-2">{task.description}</p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.priority === 'high' ? 'bg-red-100 text-red-600' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {task.priority === 'high' ? 'Высокий' : 
                         task.priority === 'medium' ? 'Средний' : 'Низкий'}
                      </span>
                      
                      <select
                        value={column.status}
                        onChange={(e) => moveTask(task.id, e.target.value)}
                        className="text-xs border rounded px-1 py-1"
                      >
                        <option value="pending">К выполнению</option>
                        <option value="approval">На согласовании</option>
                        <option value="in-progress">В процессе</option>
                        <option value="completed">Выполнено</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('KanbanBoard component error:', error);
    return null;
  }
}