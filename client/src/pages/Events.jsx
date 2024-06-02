// client/src/pages/Events.jsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';

const Events = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>My Events</h2>
      {userData.events.length ? (
        <ul>
          {userData.events.map((event) => (
            <li key={event._id}>
              <h3>{event.event_name}</h3>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Location: {event.location}</p>
              <h4>Tasks</h4>
              <ul>
                {event.tasks.map((task) => (
                  <li key={task._id}>
                    {task.task_name} - {task.complete ? 'Complete' : 'Incomplete'}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No events found</p>
      )}
    </div>
  );
};

export default Events;
