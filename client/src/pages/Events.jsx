import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import dayjs from 'dayjs';
import { ADD_EVENT, ADD_TASK, EDIT_TASK, EDIT_EVENT } from '../utils/mutations';


const Events = () => {
  const { loading, data, refetch } = useQuery(QUERY_ME);
  const [addEvent] = useMutation(ADD_EVENT);
  const [addTask] = useMutation(ADD_TASK);
  const [editTask] = useMutation(EDIT_TASK);
  const [editEvent] = useMutation(EDIT_EVENT);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [userData, setUserData] = useState(null);
  const [formState, setFormState] = useState({ event_name: '', date: '', location: '' });
  const [taskFormState, setTaskFormState] = useState({ task_name: '' });
  const [isEditing, setIsEditing] = useState(null);
  const [editFormState, setEditFormState] = useState({ task_name: '', details: '', complete: false });
  const [eventEditFormState, setEventEditFormState] = useState({ event_name: '', date: '', location: '' });

  useEffect(() => {
    if (data) {
      setUserData(data.me);
    }
  }, [data]);

  const handleEventClick = (eventId) => {
    setSelectedEvent((prevEventId) => (prevEventId === eventId ? null : eventId));
  };

  const handleTaskClick = (taskId) => {
    const eventToUpdate = userData.events.find(event => event.tasks.some(task => task._id === taskId));

    if (eventToUpdate) {
      const updatedTasks = eventToUpdate.tasks.map(task => {
        if (task._id === taskId) {
          return {
            ...task,
            complete: !task.complete
          };
        }
        return task;
      });

      const updatedEvents = userData.events.map(event => {
        if (event._id === eventToUpdate._id) {
          return {
            ...event,
            tasks: updatedTasks
          };
        }
        return event;
      });

      setUserData({
        ...userData,
        events: updatedEvents
      });
    }
    setSelectedTask(taskId === selectedTask ? null : taskId);
  };

  const handleChange = ({ target: { name, value } }) => {
    console.log(value)
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleTaskChange = ({ target: { name, value } }) => {
    setTaskFormState({
      ...taskFormState,
      [name]: value
    });
  };

  const handleEventEditChange = ({ target: { name, value } }) => {
    setEventEditFormState({
      ...eventEditFormState,
      [name]: value
    });
  };

  const handleAddEvent = async (event) => {
    event.preventDefault();
    try {
      const { data } = await addEvent({
        variables: { ...formState }
      });

      if (data) {
        refetch();
        setFormState({ event_name: '', date: '', location: '' });
      }
    } catch (e) {
      console.error('Error adding event:', e);
    }
  };

  const handleAddTask = async (event) => {
    event.preventDefault();
    try {
      const { data } = await addTask({ variables: { ...taskFormState, eventId: selectedEvent } });
      if (data) {
        refetch();
        setTaskFormState({ task_name: '' });
      }
    } catch (e) {
      console.error('Error adding task:', e);
    }
  };

  const handleEditTask = async (event) => {
    event.preventDefault();
    try {
      const { data } = await editTask({
        variables: { taskId: isEditing, ...editFormState }
      });

      if (data) {
        refetch();
        setIsEditing(null);
        setEditFormState({ task_name: '', details: '', complete: false });
      }
    } catch (e) {
      console.error('Error editing task:', e);
    }
  };

  const handleEditEvent = async (event) => {
    event.preventDefault();
    try {
      const { data } = await editEvent({
        variables: { eventId: selectedEvent, ...eventEditFormState }
      });

      if (data) {
        refetch();
        setSelectedEvent(null);
        setEventEditFormState({ event_name: '', date: '', location: '' });
      }
    } catch (e) {
      console.error('Error editing event:', e);
    }
  };

  const handleEditTaskChange = ({ target: { name, value } }) => {
    setEditFormState({
      ...editFormState,
      [name]: value
    });
  };

  const handleEditButtonClick = (task) => {
    setIsEditing(task._id);
    setEditFormState({ task_name: task.task_name, details: task.details, complete: task.complete });
  };

  const handleEditEventButtonClick = (event) => {
    setSelectedEvent(event._id);
    setEventEditFormState({ event_name: event.event_name, date: event.date, location: event.location });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  console.log(selectedEvent)

  return (
    <div>
      <h2>My Events</h2>
      {userData.events && userData.events.length > 0 ? (
        <ul style={{ listStyleType: 'none' }}>
          {userData.events.map((event) => (
            <li key={event._id}>
              <button onClick={() => handleEventClick(event._id)}>
                {event.event_name}
              </button>
              {selectedEvent === event._id && (
                <div>
                 {/* Parse the date string into a Date object */}
            {event.date && (
              <p>Date: {event.date ? dayjs(event.date).format('MM/DD/YYYY') : 'Invalid Date'}</p>
            )}
                  <form onSubmit={handleEditEvent}>
                    <input
                      type="text"
                      name="event_name"
                      value={eventEditFormState.event_name}
                      onChange={handleEventEditChange}
                      required
                    />
                    <input
                      type="date"
                      name="date"
                      value={eventEditFormState.date}
                      onChange={handleEventEditChange}
                      required
                    />
                    <input
                      type="text"
                      name="location"
                      value={eventEditFormState.location}
                      onChange={handleEventEditChange}
                    />
                    <button type="submit">Save Event</button>
                  </form>
                  <p>Location: {event.location}</p>
                  <h4>Tasks</h4>
                  <ul style={{ listStyleType: 'none' }}>
                    {event.tasks.map((task) => (
                      <li key={task._id}>
                        <input
                          type="checkbox"
                          checked={task.complete}
                          onChange={() => handleTaskClick(task._id)}
                        />
                        {isEditing === task._id ? (
                          <div>
                            <form onSubmit={handleEditTask}>
                              <input
                                type="text"
                                name="task_name"
                                value={editFormState.task_name}
                                onChange={handleEditTaskChange}
                              />
                              <input
                                type="text"
                                name="details"
                                value={editFormState.details}
                                onChange={handleEditTaskChange}
                              />
                              <button type="submit">Save</button>
                            </form>
                          </div>
                        ) : (
                          <div onClick={() => handleEditButtonClick(task)}>
                            <label>
                              {task.task_name} - {task.complete ? 'Complete' : 'Incomplete'}
                            </label>
                            <p>{task.details}</p>
                          </div>
                        )}
                      </li>
                    ))}
                    <form onSubmit={handleAddTask} id={event._id}>
                      <input
                        className="form-input"
                        placeholder="Task Name"
                        name="task_name"
                        type="text"
                        value={taskFormState.task_name}
                        onChange={handleTaskChange}
                      />
                      <button className="btn btn-block btn-info" type="submit">
                        Submit
                      </button>
                    </form>
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No events found</p>
      )}
      <form onSubmit={handleAddEvent}>
        <input
          className="form-input"
          placeholder="Event Name"
          name="event_name"
          type="text"
          value={formState.event_name}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          placeholder="Date"
          name="date"
          type="date"
          value={formState.date}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          placeholder="Location"
          name="location"
          type="text"
          value={formState.location}
          onChange={handleChange}
        />
        <button className="btn btn-block btn-info" type="submit">
          Add Event
        </button>
      </form>
    </div>
  );
};


export default Events;
