// client/src/components/EventDetails/index.jsx
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { QUERY_EVENT, QUERY_ME } from '../../utils/queries';
import { EDIT_EVENT, DELETE_EVENT } from '../../utils/mutations';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import TaskDetails from '../TaskDetails';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { loading, data, error } = useQuery(QUERY_EVENT, {
    variables: { id: eventId },
  });
  const [editEvent] = useMutation(EDIT_EVENT);
  const [deleteEvent] = useMutation(DELETE_EVENT);
  const [isEditing, setIsEditing] = useState(false);
  const [eventEditFormState, setEventEditFormState] = useState({ event_name: '', date: '', location: '' });

  useEffect(() => {
    if (data) {
      const { event } = data;
      setEventEditFormState({
        event_name: event.event_name,
        date: event.date,
        location: event.location,
      });
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleEditChange = ({ target: { name, value } }) => {
    setEventEditFormState({
      ...eventEditFormState,
      [name]: value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await editEvent({
        variables: { eventId, ...eventEditFormState },
      });
      setIsEditing(false);
      // Optionally refetch the data or update the state
    } catch (e) {
      console.error('Error editing event:', e);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEvent({
        variables: { eventId },
        update: (cache) => {
          const { me } = cache.readQuery({ query: QUERY_ME });
          const updatedEvents = me.events.filter(event => event._id !== eventId);
          cache.writeQuery({
            query: QUERY_ME,
            data: { me: { ...me, events: updatedEvents } },
          });
        },
      });
      navigate('/events'); // Redirect back to events page
    } catch (e) {
      console.error('Error deleting event:', e);
    }
  };

  return (
    <div>
      <h2>{eventEditFormState.event_name}</h2>
      <p>Date: {eventEditFormState.date ? dayjs(eventEditFormState.date).format('MM/DD/YYYY hh:mm') : 'Invalid Date'}</p>
      <p>Location: {eventEditFormState.location}</p>

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            name="event_name"
            value={eventEditFormState.event_name}
            onChange={handleEditChange}
            placeholder="Event Name"
            required
          />
          <input
            type="datetime-local"
            name="date"
            value={eventEditFormState.date}
            onChange={handleEditChange}
            required
          />
          <input
            type="text"
            name="location"
            value={eventEditFormState.location}
            onChange={handleEditChange}
            placeholder="Location"
          />
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}

      <TaskDetails />
    </div>
  );
};

export default EventDetails;
