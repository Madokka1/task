function Dashboard({ user, onLogout, tasks, onAddTask, onUpdateTask, onDeleteTask }) {
  try {
    const [activeSection, setActiveSection] = React.useState('tasks');

    const menuItems = [
      { id: 'tasks', name: 'Задачи', icon: 'clipboard-list' },
      { id: 'kanban', name: 'Канбан', icon: 'columns' },
      { id: 'finances', name: 'Финансы', icon: 'dollar-sign' },
      { id: 'calendar', name: 'Календарь', icon: 'calendar' },
      { id: 'archive', name: 'Архив', icon: 'archive' }
    ];

    const renderContent = () => {
      switch (activeSection) {
        case 'tasks':
          return (
            <TaskList 
              tasks={tasks.filter(t => !t.completed)}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
              onAddTask={onAddTask}
            />
          );
        case 'kanban':
          return <KanbanBoard tasks={tasks} onUpdateTask={onUpdateTask} onAddTask={onAddTask} />;
        case 'finances':
          return <FinanceTracker />;
        case 'calendar':
          return <Calendar tasks={tasks} onAddTask={onAddTask} />;
        case 'archive':
          return <Archive tasks={tasks.filter(t => t.completed)} />;
        default:
          return null;
      }
    };

    return (
      <div className="min-h-screen bg-gray-50" data-name="dashboard" data-file="components/Dashboard.js">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-sm min-h-screen">
            <div className="p-6 border-b border-[var(--border-color)]">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">TaskFlow</h1>
              <p className="text-sm text-[var(--text-secondary)]">Привет, {user.name}!</p>
            </div>
            
            <nav className="p-4">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
                    activeSection === item.id 
                      ? 'bg-[var(--primary-color)] text-white' 
                      : 'text-[var(--text-secondary)] hover:bg-gray-100'
                  }`}
                >
                  <div className={`icon-${item.icon} text-lg`}></div>
                  {item.name}
                </button>
              ))}
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
              <button onClick={onLogout} className="btn-secondary w-full">
                <div className="icon-log-out text-sm mr-2"></div>
                Выйти
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard component error:', error);
    return null;
  }
}