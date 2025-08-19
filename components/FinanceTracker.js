function FinanceTracker() {
  try {
    const [transactions, setTransactions] = React.useState([]);
    const [newTransaction, setNewTransaction] = React.useState({
      amount: '',
      category: 'other',
      description: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense' // expense or income
    });
    const [isEditing, setIsEditing] = React.useState(null);
    const [editTransaction, setEditTransaction] = React.useState({});

    React.useEffect(() => {
      const saved = localStorage.getItem('taskflow-transactions');
      if (saved) setTransactions(JSON.parse(saved));
    }, []);

    React.useEffect(() => {
      localStorage.setItem('taskflow-transactions', JSON.stringify(transactions));
    }, [transactions]);

    const expenseCategories = [
      { id: 'food', name: 'Еда', color: 'bg-blue-100 text-blue-600' },
      { id: 'transport', name: 'Транспорт', color: 'bg-green-100 text-green-600' },
      { id: 'entertainment', name: 'Развлечения', color: 'bg-purple-100 text-purple-600' },
      { id: 'work', name: 'Работа', color: 'bg-orange-100 text-orange-600' },
      { id: 'other', name: 'Прочее', color: 'bg-gray-100 text-gray-600' }
    ];

    const incomeCategories = [
      { id: 'salary', name: 'Зарплата', color: 'bg-emerald-100 text-emerald-600' },
      { id: 'freelance', name: 'Фриланс', color: 'bg-teal-100 text-teal-600' },
      { id: 'investment', name: 'Инвестиции', color: 'bg-indigo-100 text-indigo-600' },
      { id: 'bonus', name: 'Бонус', color: 'bg-cyan-100 text-cyan-600' },
      { id: 'other', name: 'Прочее', color: 'bg-gray-100 text-gray-600' }
    ];

    const getCurrentCategories = (type) => {
      return type === 'expense' ? expenseCategories : incomeCategories;
    };

    const addTransaction = (e) => {
      e.preventDefault();
      if (!newTransaction.amount || !newTransaction.description) return;

      const transaction = {
        id: Date.now().toString(),
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
        createdAt: new Date().toISOString()
      };

      setTransactions(prev => [transaction, ...prev]);
      setNewTransaction({
        amount: '',
        category: newTransaction.type === 'expense' ? 'other' : 'salary',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: newTransaction.type
      });
    };

    const startEdit = (transaction) => {
      setIsEditing(transaction.id);
      setEditTransaction({ ...transaction });
    };

    const saveEdit = () => {
      if (!editTransaction.amount || !editTransaction.description) return;
      
      setTransactions(prev => prev.map(t => 
        t.id === isEditing 
          ? { ...editTransaction, amount: parseFloat(editTransaction.amount) }
          : t
      ));
      setIsEditing(null);
      setEditTransaction({});
    };

    const cancelEdit = () => {
      setIsEditing(null);
      setEditTransaction({});
    };

    const deleteTransaction = (id) => {
      if (confirm('Удалить эту запись?')) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      }
    };

    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    React.useEffect(() => {
      if (chartRef.current && transactions.length > 0) {
        const ctx = chartRef.current.getContext('2d');
        
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const expensesByCategory = expenseCategories.map(cat => ({
          name: cat.name,
          amount: transactions.filter(t => t.type === 'expense' && t.category === cat.id).reduce((sum, t) => sum + t.amount, 0),
          color: cat.id === 'food' ? '#3b82f6' : cat.id === 'transport' ? '#10b981' : cat.id === 'entertainment' ? '#8b5cf6' : cat.id === 'work' ? '#f59e0b' : '#6b7280'
        })).filter(cat => cat.amount > 0);

        if (expensesByCategory.length > 0) {
          chartInstance.current = new ChartJS(ctx, {
            type: 'doughnut',
            data: {
              labels: expensesByCategory.map(cat => cat.name),
              datasets: [{
                data: expensesByCategory.map(cat => cat.amount),
                backgroundColor: expensesByCategory.map(cat => cat.color),
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
      }
    }, [transactions]);

    const getCategoryInfo = (type, categoryId) => {
      const categories = getCurrentCategories(type);
      return categories.find(c => c.id === categoryId) || categories[categories.length - 1];
    };

    return (
      <div data-name="finance-tracker" data-file="components/FinanceTracker.js">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Финансовый анализ</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="task-card mb-6">
              <h3 className="text-lg font-semibold mb-4">Добавить запись</h3>
              
              {/* Toggle для типа транзакции */}
              <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setNewTransaction({...newTransaction, type: 'expense', category: 'other'})}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    newTransaction.type === 'expense' 
                      ? 'bg-red-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Трата
                </button>
                <button
                  type="button"
                  onClick={() => setNewTransaction({...newTransaction, type: 'income', category: 'salary'})}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    newTransaction.type === 'income' 
                      ? 'bg-green-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Доход
                </button>
              </div>

              <form onSubmit={addTransaction} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Сумма"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    className="input-field"
                    required
                  />
                  <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    className="input-field"
                  >
                    {getCurrentCategories(newTransaction.type).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Описание"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="input-field"
                  required
                />
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  className="input-field"
                />
                <button type="submit" className="btn-primary">
                  <div className="icon-plus text-lg mr-2"></div>
                  Добавить {newTransaction.type === 'expense' ? 'трату' : 'доход'}
                </button>
              </form>
            </div>

            <div className="space-y-3">
              {transactions.map(transaction => (
                <div key={transaction.id} className="task-card">
                  {isEditing === transaction.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="number"
                          value={editTransaction.amount}
                          onChange={(e) => setEditTransaction({...editTransaction, amount: e.target.value})}
                          className="input-field"
                        />
                        <select
                          value={editTransaction.category}
                          onChange={(e) => setEditTransaction({...editTransaction, category: e.target.value})}
                          className="input-field"
                        >
                          {getCurrentCategories(editTransaction.type).map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        value={editTransaction.description}
                        onChange={(e) => setEditTransaction({...editTransaction, description: e.target.value})}
                        className="input-field"
                      />
                      <input
                        type="date"
                        value={editTransaction.date}
                        onChange={(e) => setEditTransaction({...editTransaction, date: e.target.value})}
                        className="input-field"
                      />
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="btn-success">
                          <div className="icon-check text-sm mr-1"></div>
                          Сохранить
                        </button>
                        <button onClick={cancelEdit} className="btn-secondary text-sm">
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{transaction.description}</h4>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {new Date(transaction.date).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold text-lg ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{transaction.amount} ₽
                        </p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          getCategoryInfo(transaction.type, transaction.category).color
                        }`}>
                          {getCategoryInfo(transaction.type, transaction.category).name}
                        </span>
                        <div className="flex gap-1 mt-2">
                          <button
                            onClick={() => startEdit(transaction)}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            <div className="icon-edit"></div>
                          </button>
                          <button
                            onClick={() => deleteTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            <div className="icon-trash-2"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="task-card mb-6">
              <h3 className="text-lg font-semibold mb-4">Баланс</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-green-600">Доходы:</span>
                  <span className="font-semibold text-green-600">+{totalIncome.toFixed(2)} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Расходы:</span>
                  <span className="font-semibold text-red-600">-{totalExpenses.toFixed(2)} ₽</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="font-semibold">Итого:</span>
                  <span className={`font-bold text-lg ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {balance >= 0 ? '+' : ''}{balance.toFixed(2)} ₽
                  </span>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                Всего записей: {transactions.length}
              </p>
            </div>
            
            {transactions.filter(t => t.type === 'expense').length > 0 && (
              <div className="task-card">
                <h3 className="text-lg font-semibold mb-4">Распределение трат</h3>
                <div className="w-full h-64 flex items-center justify-center">
                  <canvas ref={chartRef}></canvas>
                </div>
                <div className="mt-4 space-y-2">
                  {expenseCategories.map(cat => {
                    const amount = transactions.filter(t => t.type === 'expense' && t.category === cat.id).reduce((sum, t) => sum + t.amount, 0);
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