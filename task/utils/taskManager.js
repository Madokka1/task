// Task management utility functions
const TaskManager = {
  // Save tasks to localStorage
  saveTasks: (tasks) => {
    try {
      localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  },

  // Load tasks from localStorage
  loadTasks: () => {
    try {
      const saved = localStorage.getItem('taskflow-tasks');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },

  // Generate unique task ID
  generateId: () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  },

  // Validate task data
  validateTask: (task) => {
    return {
      isValid: !!(task.title && task.title.trim()),
      errors: {
        title: !task.title || !task.title.trim() ? 'Название задачи обязательно' : null
      }
    };
  },

  // Sort tasks by various criteria
  sortTasks: (tasks, criteria = 'createdAt', order = 'desc') => {
    return [...tasks].sort((a, b) => {
      let aValue = a[criteria];
      let bValue = b[criteria];

      // Handle priority sorting
      if (criteria === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority] || 2;
        bValue = priorityOrder[b.priority] || 2;
      }

      // Handle date sorting
      if (criteria === 'createdAt' || criteria === 'dueDate') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  },

  // Filter tasks by status, priority, or due date
  filterTasks: (tasks, filters) => {
    return tasks.filter(task => {
      // Filter by completion status
      if (filters.status === 'completed' && !task.completed) return false;
      if (filters.status === 'pending' && task.completed) return false;

      // Filter by priority
      if (filters.priority && task.priority !== filters.priority) return false;

      // Filter by overdue status
      if (filters.overdue && (!task.dueDate || new Date(task.dueDate) >= new Date())) return false;

      return true;
    });
  },

  // Get task statistics
  getStats: (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(t => 
      !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
    ).length;

    const priorityStats = tasks.reduce((acc, task) => {
      if (!task.completed) {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      priorityStats
    };
  }
};

// Export for use in other components
window.TaskManager = TaskManager;