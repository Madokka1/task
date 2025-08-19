function AuthForm({ onLogin }) {
  try {
    const [isLogin, setIsLogin] = React.useState(true);
    const [formData, setFormData] = React.useState({
      name: '',
      email: '',
      password: ''
    });
    const [error, setError] = React.useState('');

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
      setError('');
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      setError('');

      if (isLogin) {
        const result = AuthManager.login(formData.email, formData.password);
        if (result.success) {
          onLogin(result.user);
        } else {
          setError(result.error);
        }
      } else {
        if (!formData.name.trim()) {
          setError('Введите имя');
          return;
        }
        const result = AuthManager.register(formData.name, formData.email, formData.password);
        if (result.success) {
          onLogin(result.user);
        } else {
          setError(result.error);
        }
      }
    };

    const toggleMode = () => {
      setIsLogin(!isLogin);
      setError('');
      setFormData({ name: '', email: '', password: '' });
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-name="auth-form" data-file="components/AuthForm.js">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">TaskFlow</h1>
            <p className="text-[var(--text-secondary)]">
              {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
            </p>
          </div>

          <div className="task-card">
            <h2 className="text-xl font-semibold mb-6 text-center text-[var(--text-primary)]">
              {isLogin ? 'Вход' : 'Регистрация'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ваше имя"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              )}

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Пароль"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                  minLength="6"
                />
              </div>

              {error && (
                <div className="text-[var(--danger-color)] text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary w-full">
                <div className={`${isLogin ? 'icon-log-in' : 'icon-user-plus'} text-lg mr-2`}></div>
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[var(--text-secondary)]">
                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                <button
                  onClick={toggleMode}
                  className="ml-2 text-[var(--primary-color)] hover:underline"
                >
                  {isLogin ? 'Зарегистрироваться' : 'Войти'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AuthForm component error:', error);
    return null;
  }
}