// Authentication management utility
const AuthManager = {
  // Register new user
  register: (name, email, password) => {
    try {
      if (!name.trim() || !email.trim() || !password.trim()) {
        return { success: false, error: 'Все поля обязательны для заполнения' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Пароль должен содержать минимум 6 символов' };
      }

      const users = AuthManager.getUsers();
      
      if (users.find(user => user.email === email)) {
        return { success: false, error: 'Пользователь с таким email уже существует' };
      }

      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: AuthManager.hashPassword(password),
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('taskflow-users', JSON.stringify(users));
      
      const userForSession = { ...newUser };
      delete userForSession.password;
      
      localStorage.setItem('taskflow-current-user', JSON.stringify(userForSession));
      
      return { success: true, user: userForSession };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Ошибка при регистрации' };
    }
  },

  // Login user
  login: (email, password) => {
    try {
      if (!email.trim() || !password.trim()) {
        return { success: false, error: 'Введите email и пароль' };
      }

      const users = AuthManager.getUsers();
      const user = users.find(u => 
        u.email === email.trim().toLowerCase() && 
        u.password === AuthManager.hashPassword(password)
      );

      if (!user) {
        return { success: false, error: 'Неверный email или пароль' };
      }

      const userForSession = { ...user };
      delete userForSession.password;
      
      localStorage.setItem('taskflow-current-user', JSON.stringify(userForSession));
      
      return { success: true, user: userForSession };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Ошибка при входе' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('taskflow-current-user');
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('taskflow-current-user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Get all users
  getUsers: () => {
    try {
      const users = localStorage.getItem('taskflow-users');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  // Simple password hashing (not for production use)
  hashPassword: (password) => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  },

  // Get user-specific tasks
  getUserTasks: (userId) => {
    try {
      const tasks = localStorage.getItem(`taskflow-tasks-${userId}`);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error getting user tasks:', error);
      return [];
    }
  },

  // Save user-specific tasks
  saveUserTasks: (userId, tasks) => {
    try {
      localStorage.setItem(`taskflow-tasks-${userId}`, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving user tasks:', error);
    }
  }
};

// Export for use in other components
window.AuthManager = AuthManager;