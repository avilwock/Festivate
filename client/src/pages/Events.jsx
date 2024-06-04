import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { ADD_EVENT, ADD_TASK } from '../utils/mutations';

const Events = () => {
  const { loading, data, refetch } = useQuery(QUERY_ME);
  const [addEvent] = useMutation(ADD_EVENT);
  const [addTask] = useMutation(ADD_TASK);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [userData, setUserData] = useState(null);
  const [formState, setFormState] = useState({ event_name: '', date: '', location: '' });
  const [taskFormState, setTaskFormState] = useState({ task_name: '' });

  useEffect(() => {
    if (data) {
      console.log('Fetched data:', data);  // Verify data reception
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
      console.error(e);
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
      console.error(e);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

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
                  <p>Date: {new Date(event.date).toLocaleDateString()}</p>
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
                        <label htmlFor={task._id}>
                          {task.task_name} - {task.complete ? 'Complete' : 'Incomplete'}
                        </label>
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
