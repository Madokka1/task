function Calendar({ tasks, onAddTask }) {
  try {
    const [events, setEvents] = React.useState([]);
    const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [newEvent, setNewEvent] = React.useState({
      title: '',
      description: '',
      date: selectedDate,
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

    const getEventsForDate = (date) => {
      return events.filter(event => event.date === date);
    };

    const getTasksForDate = (date) => {
      return tasks.filter(task => task.dueDate === date);
    };

    return (
      <div data-name="calendar" data-file="components/Calendar.js">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Календарь</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
                <div className="grid grid-cols-2 gap-4">
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
                </div>
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
                <button type="submit" className="btn-primary">
                  <div className="icon-plus text-lg mr-2"></div>
                  Добавить событие
                </button>
              </form>
            </div>

            <div className="task-card">
              <h3 className="text-lg font-semibold mb-4">
                События на {new Date(selectedDate).toLocaleDateString('ru-RU')}
              </h3>
              
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field mb-4"
              />

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
                      {event.time && (
                        <span className="text-sm font-medium">{event.time}</span>
                      )}
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

          <div>
            <div className="task-card">
              <h3 className="text-lg font-semibold mb-4">Ближайшие события</h3>
              <div className="space-y-3">
                {events.slice(0, 5).map(event => (
                  <div key={event.id} className="text-sm">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-[var(--text-secondary)]">
                      {new Date(event.date).toLocaleDateString('ru-RU')}
                      {event.time && ` в ${event.time}`}
                    </p>
                  </div>
                ))}
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