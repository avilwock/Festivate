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

  const [eventEditFormState, setEventEditFormState] = useState({ event_name: '', date: '', location: '', venue_layout: '', theme: '', budget: '', guest_count: '', food_options: '', entertainment: '', decorations: '', details: '' });

  useEffect(() => {
    if (data) {
      const { event } = data;
      setEventEditFormState({
        event_name: event.event_name,
        date: event.date,
        location: event.location,

        venue_layout: event.venue_layout,
        theme: event.theme,
        budget: event.budget,
        guest_count: event.guest_count,
        food_options: event.food_options,
        entertainment: event.entertainment,
        decorations: event.decorations,
        details: event.details

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
      // Parse budget and guest_count before submitting
      const budgetValue = parseFloat(eventEditFormState.budget);
      const guestCountValue = parseInt(eventEditFormState.guest_count);

      await editEvent({
        variables: {
          eventId,
          ...eventEditFormState,
          budget: isNaN(budgetValue) ? null : budgetValue,
          guest_count: isNaN(guestCountValue) ? null : guestCountValue,
        },
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
          const updatedEvents = me.events.filter((event) => event._id !== eventId);
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
    <div className="event-details-container">
      <div className="event-details-content">
        <div className="event-details-text">
          <h2>{eventEditFormState.event_name}</h2>
          <p>Date: {eventEditFormState.date ? dayjs(eventEditFormState.date).format('MM/DD/YYYY hh:mm') : 'Invalid Date'}</p>
          <p>Location: {eventEditFormState.location}</p>
          <p>Budget: {eventEditFormState.budget}</p>
          <p>Guest Count: {eventEditFormState.guest_count}</p>
          <p>Venue Layout: {eventEditFormState.venue_layout}</p>
          <p>Theme: {eventEditFormState.theme}</p>
          <p>Food Options: {eventEditFormState.food_options}</p>
          <p>Entertainment: {eventEditFormState.entertainment}</p>
          <p>Decorations: {eventEditFormState.decorations}</p>
          <p>Details: {eventEditFormState.details}</p>
        </div>

        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="event-form">
            <div className="form-group">
              <label htmlFor="event_name">Event Name:</label>
              <input
                type="text"
                name="event_name"
                value={eventEditFormState.event_name}
                onChange={handleEditChange}
                placeholder="Event Name"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input
                type="datetime-local"
                name="date"
                value={eventEditFormState.date}
                onChange={handleEditChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                name="location"
                value={eventEditFormState.location}
                onChange={handleEditChange}
                placeholder="Location"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="venue_layout">Venue Layout:</label>
              <input
                type="text"
                name="venue_layout"
                value={eventEditFormState.venue_layout}
                onChange={handleEditChange}
                placeholder="Venue Layout"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="theme">Theme:</label>
              <input
                type="text"
                name="theme"
                value={eventEditFormState.theme}
                onChange={handleEditChange}
                placeholder="Theme"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="budget">Budget:</label>
              <input
                type="text"
                name="budget"
                value={eventEditFormState.budget}
                onChange={handleEditChange}
                placeholder="Budget"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="guest_count">Guest Count:</label>
              <input
                type="text"
                name="guest_count"
                value={eventEditFormState.guest_count}
                onChange={handleEditChange}
                placeholder="Guest Count"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="food_options">Food Options:</label>
              <input
                type="text"
                name="food_options"
                value={eventEditFormState.food_options}
                onChange={handleEditChange}
                placeholder="Food Options"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="entertainment">Entertainment:</label>
              <input
                type="text"
                name="entertainment"
                value={eventEditFormState.entertainment}
                onChange={handleEditChange}
                placeholder="Entertainment"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="decorations">Decorations:</label>
              <input
                type="text"
                name="decorations"
                value={eventEditFormState.decorations}
                onChange={handleEditChange}
                placeholder="Decorations"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="details">Details:</label>
              <input
                type="text"
                name="details"
                value={eventEditFormState.details}
                onChange={handleEditChange}
                placeholder="Details"
                className="form-input"
              />
            </div>
            <button type="submit">Save</button>
          </form>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </>
        )}
      </div>

      {/* Move TaskDetails here */}
      <TaskDetails />
    </div>
  );
};

export default EventDetails;
