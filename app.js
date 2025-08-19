class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-black"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [user, setUser] = React.useState(null);
    const [tasks, setTasks] = React.useState([]);
    const [filter, setFilter] = React.useState('all');
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const currentUser = AuthManager.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const userTasks = AuthManager.getUserTasks(currentUser.id);
        setTasks(userTasks);
      }
      setLoading(false);
    }, []);

    React.useEffect(() => {
      if (user && tasks.length >= 0) {
        AuthManager.saveUserTasks(user.id, tasks);
      }
    }, [tasks, user]);

    const handleLogin = (userData) => {
      setUser(userData);
      const userTasks = AuthManager.getUserTasks(userData.id);
      setTasks(userTasks);
    };

    const handleLogout = () => {
      AuthManager.logout();
      setUser(null);
      setTasks([]);
      setFilter('all');
    };

    const addTask = (taskData) => {
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [newTask, ...prev]);
    };

    const updateTask = (taskId, updates) => {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ));
    };

    const deleteTask = (taskId) => {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    };

    const filteredTasks = tasks.filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    });

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="icon-loader text-4xl text-[var(--primary-color)] mb-4 animate-spin"></div>
            <p className="text-[var(--text-secondary)]">Загрузка...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return <AuthForm onLogin={handleLogin} />;
    }

    return (
      <Dashboard 
        user={user}
        onLogout={handleLogout}
        tasks={tasks}
        onAddTask={addTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);