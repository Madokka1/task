function AddTaskForm({ onAddTask }) {
  try {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [priority, setPriority] = React.useState('medium');
    const [dueDate, setDueDate] = React.useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!title.trim()) return;

      onAddTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null
      });

      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    };

    return (
      <div className="task-card mb-6" data-name="add-task-form" data-file="components/AddTaskForm.js">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Добавить новую задачу</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Название задачи"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <textarea
              placeholder="Описание (необязательно)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none"
              rows="3"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="input-field"
              >
                <option value="low">Низкий приоритет</option>
                <option value="medium">Средний приоритет</option>
                <option value="high">Высокий приоритет</option>
              </select>
            </div>
            
            <div className="flex-1">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            <div className="icon-plus text-lg mr-2"></div>
            Добавить задачу
          </button>
        </form>
      </div>
    );
  } catch (error) {
    console.error('AddTaskForm component error:', error);
    return null;
  }
}