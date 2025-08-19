function FinanceTracker() {
  try {
    const [expenses, setExpenses] = React.useState([]);
    const [newExpense, setNewExpense] = React.useState({
      amount: '',
      category: 'other',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });

    React.useEffect(() => {
      const saved = localStorage.getItem('taskflow-expenses');
      if (saved) setExpenses(JSON.parse(saved));
    }, []);

    React.useEffect(() => {
      localStorage.setItem('taskflow-expenses', JSON.stringify(expenses));
    }, [expenses]);

    const categories = [
      { id: 'food', name: 'Еда', color: 'bg-blue-100 text-blue-600' },
      { id: 'transport', name: 'Транспорт', color: 'bg-green-100 text-green-600' },
      { id: 'entertainment', name: 'Развлечения', color: 'bg-purple-100 text-purple-600' },
      { id: 'work', name: 'Работа', color: 'bg-orange-100 text-orange-600' },
      { id: 'other', name: 'Прочее', color: 'bg-gray-100 text-gray-600' }
    ];

    const addExpense = (e) => {
      e.preventDefault();
      if (!newExpense.amount || !newExpense.description) return;

      const expense = {
        id: Date.now().toString(),
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        createdAt: new Date().toISOString()
      };

      setExpenses(prev => [expense, ...prev]);
      setNewExpense({
        amount: '',
        category: 'other',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    };

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    React.useEffect(() => {
      if (chartRef.current && expenses.length > 0) {
        const ctx = chartRef.current.getContext('2d');
        
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const categoryTotals = categories.map(cat => ({
          name: cat.name,
          amount: expenses.filter(exp => exp.category === cat.id).reduce((sum, exp) => sum + exp.amount, 0),
          color: cat.id === 'food' ? '#3b82f6' : cat.id === 'transport' ? '#10b981' : cat.id === 'entertainment' ? '#8b5cf6' : cat.id === 'work' ? '#f59e0b' : '#6b7280'
        })).filter(cat => cat.amount > 0);

        chartInstance.current = new ChartJS(ctx, {
          type: 'doughnut',
          data: {
            labels: categoryTotals.map(cat => cat.name),
            datasets: [{
              data: categoryTotals.map(cat => cat.amount),
              backgroundColor: categoryTotals.map(cat => cat.color),
              borderWidth: 2,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }
    }, [expenses]);

    return (
      <div data-name="finance-tracker" data-file="components/FinanceTracker.js">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Финансовый анализ</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="task-card mb-6">
              <h3 className="text-lg font-semibold mb-4">Добавить трату</h3>
              <form onSubmit={addExpense} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Сумма"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="input-field"
                    required
                  />
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="input-field"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Описание"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="input-field"
                  required
                />
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="input-field"
                />
                <button type="submit" className="btn-primary">
                  <div className="icon-plus text-lg mr-2"></div>
                  Добавить трату
                </button>
              </form>
            </div>

            <div className="space-y-3">
              {expenses.map(expense => (
                <div key={expense.id} className="task-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{expense.description}</h4>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {new Date(expense.date).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">{expense.amount} ₽</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        categories.find(c => c.id === expense.category)?.color
                      }`}>
                        {categories.find(c => c.id === expense.category)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="task-card mb-6">
              <h3 className="text-lg font-semibold mb-4">Итого</h3>
              <p className="text-3xl font-bold text-[var(--danger-color)] mb-4">
                {totalExpenses.toFixed(2)} ₽
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Всего трат: {expenses.length}
              </p>
            </div>
            
            {expenses.length > 0 && (
              <div className="task-card">
                <h3 className="text-lg font-semibold mb-4">Распределение трат</h3>
                <div className="w-full h-64 flex items-center justify-center">
                  <canvas ref={chartRef}></canvas>
                </div>
                <div className="mt-4 space-y-2">
                  {categories.map(cat => {
                    const amount = expenses.filter(exp => exp.category === cat.id).reduce((sum, exp) => sum + exp.amount, 0);
                    if (amount === 0) return null;
                    return (
                      <div key={cat.id} className="flex justify-between items-center text-sm">
                        <span className={`px-2 py-1 rounded ${cat.color}`}>{cat.name}</span>
                        <span className="font-medium">{amount.toFixed(2)} ₽</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('FinanceTracker component error:', error);
    return null;
  }
}