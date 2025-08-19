function TaskItem({ task, onUpdate, onDelete }) {
  try {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editTitle, setEditTitle] = React.useState(task.title);
    const [editDescription, setEditDescription] = React.useState(task.description);

    const handleSave = () => {
      if (!editTitle.trim()) return;
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim()
      });
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditTitle(task.title);
      setEditDescription(task.description);
      setIsEditing(false);
    };

    const toggleComplete = () => {
      onUpdate(task.id, { completed: !task.completed });
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

    const formatDate = (dateString) => {
      if (!dateString) return null;
      return new Date(dateString).toLocaleDateString('ru-RU');
    };

    return (
      <div className={`task-card ${task.completed ? 'opacity-75' : ''}`} data-name="task-item" data-file="components/TaskItem.js">
        <div className="flex items-start gap-3">
          <button
            onClick={toggleComplete}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              task.completed 
                ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white' 
                : 'border-gray-300 hover:border-[var(--accent-color)]'
            }`}
          >
            {task.completed && <div className="icon-check text-xs"></div>}
          </button>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input-field text-lg font-medium"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="input-field resize-none"
                  rows="2"
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="btn-success">
                    <div className="icon-check text-sm mr-1"></div>
                    Сохранить
                  </button>
                  <button onClick={handleCancel} className="btn-secondary text-sm">
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className={`text-lg font-medium mb-1 ${task.completed ? 'line-through text-gray-500' : 'text-[var(--text-primary)]'}`}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className={`text-sm mb-3 ${task.completed ? 'line-through text-gray-400' : 'text-[var(--text-secondary)]'}`}>
                    {task.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs">
                  <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                    {getPriorityText(task.priority)}
                  </span>
                  
                  {task.dueDate && (
                    <span className="text-[var(--text-secondary)] flex items-center">
                      <div className="icon-calendar text-sm mr-1"></div>
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                  
                  <span className="text-[var(--text-secondary)]">
                    {formatDate(task.createdAt)}
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary text-sm"
                  >
                    <div className="icon-edit text-sm mr-1"></div>
                    Редактировать
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="btn-danger"
                  >
                    <div className="icon-trash-2 text-sm mr-1"></div>
                    Удалить
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('TaskItem component error:', error);
    return null;
  }
}