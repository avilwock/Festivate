// client/src/pages/Profile.jsx
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { EDIT_TASK } from '../utils/mutations';

const Profile = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [editTask] = useMutation(EDIT_TASK);
  const userData = data?.me || {};

  // Sort events by date
  const sortedEvents = userData.events?.slice().sort((a, b) => new Date(a.date) - new Date(b.date)) || [];

  // Get next three incomplete tasks
  const incompleteTasks = sortedEvents.flatMap(event => event.tasks.filter(task => !task.complete));
  const nextThreeTasks = incompleteTasks.slice(0, 3);

  // Handle task completion
  const handleTaskCompletion = async (taskId) => {
    try {
      await editTask({
        variables: {
          taskId,
          complete: true,
        },
        refetchQueries: [{ query: QUERY_ME }],
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h2>Welcome, {userData.username}!</h2>
      <div className="events-tasks-container">
        <div className="events-section" style={{ width: '75%' }}>
          <h3>My Events</h3>
          {sortedEvents.length ? (
            <ul>
              {sortedEvents.map((event) => (
                <li key={event._id} className="event">
                  <div className="event-info">
                    <h4>{event.event_name}</h4>
                    <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                    <p>Location: {event.location}</p>
                  </div>
                  <div className="event-tasks">
                    <h5>Tasks</h5>
                    <ul>
                      {event.tasks.map((task) => (
                        <li key={task._id} style={{ textDecoration: task.complete ? 'line-through' : 'none' }}>
                          {task.task_name} - {task.complete ? 'Complete' : 'Incomplete'}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No events found</p>
          )}
        </div>
        <div className="tasks-section" style={{ width: '25%' }}>
          <h3>Next Tasks</h3>
          {nextThreeTasks.length ? (
            <ul>
              {nextThreeTasks.map((task) => (
                <li key={task._id}>
                  <input
                    type="checkbox"
                    checked={task.complete}
                    onChange={() => handleTaskCompletion(task._id)}
                  />
                  {task.task_name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming tasks</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;