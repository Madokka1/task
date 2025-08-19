function Calendar({ tasks, onAddTask }) {
  try {
    const [events, setEvents] = React.useState([]);
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [newEvent, setNewEvent] = React.useState({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      linkedTaskId: ''
    });

    React.useEffect(() => {
      const saved = localStorage.getItem('taskflow-events');
      if (saved) setEvents(JSON.parse(saved));
    }, []);

    React.useEffect(() => {
      localStorage.setItem('taskflow-events', JSON.stringify(events));
    }, [events]);

    const addEvent = (e) => {
      e.preventDefault();
      if (!newEvent.title) return;

      const event = {
        id: Date.now().toString(),
        ...newEvent,
        createdAt: new Date().toISOString()
      };

      setEvents(prev => [event, ...prev]);
      setNewEvent({
        title: '',
        description: '',
        date: selectedDate,
        time: '',
        linkedTaskId: ''
      });
    };

    const deleteEvent = (eventId) => {
      if (confirm('Удалить это событие?')) {
        setEvents(prev => prev.filter(e => e.id !== eventId));
      }
    };

    const getEventsForDate = (date) => {
      return events.filter(event => event.date === date);
    };

    const getTasksForDate = (date) => {
      return tasks.filter(task => task.dueDate === date);
    };

    // Calendar generation functions
    const getDaysInMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
      return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last day (6)
    };

    const generateCalendarDays = () => {
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDay = getFirstDayOfMonth(currentDate);
      const days = [];

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
      }

      return days;
    };

    const formatDateForComparison = (year, month, day) => {
      return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const navigateMonth = (direction) => {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(prev.getMonth() + direction);
        return newDate;
      });
    };

    const selectDate = (day) => {
      if (!day) return;
      const dateStr = formatDateForComparison(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(dateStr);
      setNewEvent(prev => ({ ...prev, date: dateStr }));
    };

    const isToday = (day) => {
      if (!day) return false;
      const today = new Date();
      return (
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear()
      );
    };

    const isSelected = (day) => {
      if (!day) return false;
      const dateStr = formatDateForComparison(currentDate.getFullYear(), currentDate.getMonth(), day);
      return dateStr === selectedDate;
    };

    const hasEvents = (day) => {
      if (!day) return false;
      const dateStr = formatDateForComparison(currentDate.getFullYear(), currentDate.getMonth(), day);
      return getEventsForDate(dateStr).length > 0 || getTasksForDate(dateStr).length > 0;
    };

    const monthNames = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    return (
      <div data-name="calendar" data-file="components/Calendar.js">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Календарь</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <div className="task-card mb-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="icon-chevron-left text-xl"></div>
                </button>
                
                <h3 className="text-xl font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="icon-chevron-right text-xl"></div>
                </button>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-[var(--text-secondary)]">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => (
                  <button
                    key={index}
                    onClick={() => selectDate(day)}
                    disabled={!day}
                    className={`
                      p-3 text-center text-sm rounded-lg transition-colors relative
                      ${!day ? 'invisible' : ''}
                      ${isToday(day) ? 'bg-[var(--primary-color)] text-white font-bold' : ''}
                      ${isSelected(day) && !isToday(day) ? 'bg-blue-100 text-[var(--primary-color)] font-semibold' : ''}
                      ${!isToday(day) && !isSelected(day) ? 'hover:bg-gray-100' : ''}
                      ${hasEvents(day) && !isToday(day) && !isSelected(day) ? 'bg-green-50 text-green-700' : ''}
                    `}
                  >
                    {day}
                    {hasEvents(day) && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Date Events */}
            <div className="task-card">
              <h3 className="text-lg font-semibold mb-4">
                События на {new Date(selectedDate).toLocaleDateString('ru-RU')}
              </h3>

              <div className="space-y-3">
                {getEventsForDate(selectedDate).map(event => (
                  <div key={event.id} className="border border-[var(--border-color)] rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-[var(--text-secondary)] mt-1">{event.description}</p>
                        )}
                        {event.linkedTaskId && (
                          <p className="text-xs text-[var(--primary-color)] mt-1">
                            Связано с задачей: {tasks.find(t => t.id === event.linkedTaskId)?.title}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {event.time && (
                          <span className="text-sm font-medium">{event.time}</span>
                        )}
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <div className="icon-trash-2"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {getTasksForDate(selectedDate).map(task => (
                  <div key={`task-${task.id}`} className="border border-blue-200 bg-blue-50 rounded p-3">
                    <div className="flex items-center gap-2">
                      <div className="icon-clipboard-list text-blue-600"></div>
                      <span className="font-medium text-blue-800">Срок задачи: {task.title}</span>
                    </div>
                  </div>
                ))}

                {getEventsForDate(selectedDate).length === 0 && getTasksForDate(selectedDate).length === 0 && (
                  <p className="text-[var(--text-secondary)] text-center py-4">Нет событий на эту дату</p>
                )}
              </div>
            </div>
          </div>

          {/* Add Event Form & Upcoming Events */}
          <div>
            <div className="task-card mb-6">
              <h3 className="text-lg font-semibold mb-4">Добавить событие</h3>
              <form onSubmit={addEvent} className="space-y-4">
                <input
                  type="text"
                  placeholder="Название события"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="input-field"
                  required
                />
                <textarea
                  placeholder="Описание"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="input-field resize-none"
                  rows="2"
                />
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="input-field"
                />
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="input-field"
                />
                <select
                  value={newEvent.linkedTaskId}
                  onChange={(e) => setNewEvent({...newEvent, linkedTaskId: e.target.value})}
                  className="input-field"
                >
                  <option value="">Связать с задачей (необязательно)</option>
                  {tasks.filter(t => !t.completed).map(task => (
                    <option key={task.id} value={task.id}>{task.title}</option>
                  ))}
                </select>
                <button type="submit" className="btn-primary w-full">
                  <div className="icon-plus text-lg mr-2"></div>
                  Добавить событие
                </button>
              </form>
            </div>

            <div className="task-card">
              <h3 className="text-lg font-semibold mb-4">Ближайшие события</h3>
              <div className="space-y-3">
                {events
                  .filter(event => new Date(event.date) >= new Date())
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 5)
                  .map(event => (
                    <div key={event.id} className="text-sm">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-[var(--text-secondary)]">
                        {new Date(event.date).toLocaleDateString('ru-RU')}
                        {event.time && ` в ${event.time}`}
                      </p>
                    </div>
                  ))}
                {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
                  <p className="text-[var(--text-secondary)] text-sm">Нет предстоящих событий</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Calendar component error:', error);
    return null;
  }
}