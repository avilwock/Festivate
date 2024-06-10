import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { QUERY_ME } from '../utils/queries';
import dayjs from 'dayjs';
import { ADD_EVENT } from '../utils/mutations';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Events = () => {
  const { loading, data, refetch } = useQuery(QUERY_ME);
  const [addEvent] = useMutation(ADD_EVENT);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userData, setUserData] = useState(null);
  const [formState, setFormState] = useState({
    event_name: '',
    date: '',
    location: '',
    budget: null,
    guest_count: null,
    venue_layout: '',
    theme: '',
    food_options: '',
    entertainment: '',
    decorations: '',
    details: '',
  });
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setFormState({
      event_name: '',
      date: '',
      location: '',
      budget: null,
      guest_count: null,
      venue_layout: '',
      theme: '',
      food_options: '',
      entertainment: '',
      decorations: '',
      details: '',
    });
  };

  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    if (data) {
      setUserData(data.me);
    }
  }, [data]);

  const navigate = useNavigate();

  const handleEventClick = (eventId) => {
    setSelectedEvent(eventId);
    navigate(`/events/${eventId}`);
  };

  const handleChange = ({ target: { name, value } }) => {
    console.log("Name:", name, "Value:", value);
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleAddEvent = async (event) => {
    event.preventDefault();
    try {
      // Convert budget and guest_count to numeric values
      const budgetValue = parseFloat(formState.budget); // Convert to float
      const guestCountValue = parseInt(formState.guest_count); // Convert to integer

      const { data } = await addEvent({
        variables: {
          ...formState,
          budget: budgetValue,
          guest_count: guestCountValue,
        },
      });

      if (data) {
        refetch();
        handleClose();
      }
    } catch (e) {
      console.error('Error adding event:', e);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  return (
    <div className="events-page">
      <div className="events-container">
        <h2>My Events</h2>
        {userData.events && userData.events.length > 0 ? (
          <ul style={{ listStyleType: 'none' }} className="event-list">
            {userData.events.map((event) => (
              <li key={event._id} className="event-item">
                <button onClick={() => handleEventClick(event._id)}>
                  {event.event_name}
                </button>
                {selectedEvent === event._id && (
                  <div className="event-details">
                    {event.date && (
                      <p>Date: {dayjs(event.date).format('MM/DD/YYYY hh:mm')}</p>
                    )}
                    {event.location && (
                      <p>Location: {event.location}</p>
                    )}
                    {event.budget && (
                      <p>Budget: {event.budget}</p>
                    )}
                    {event.guest_count && (
                      <p>Guest Count: {event.guest_count}</p>
                    )}
                    {event.venue_layout && (
                      <p>Venue Layout: {event.venue_layout}</p>
                    )}
                    {event.theme && (
                      <p>Theme: {event.theme}</p>
                    )}
                    {event.food_options && (
                      <p>Food Options: {event.food_options}</p>
                    )}
                    {event.entertainment && (
                      <p>Entertainment: {event.entertainment}</p>
                    )}
                    {event.decorations && (
                      <p>Decorations: {event.decorations}</p>
                    )}
                    {event.details && (
                      <p>Details: {event.details}</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No events found. To add a new event, please select the add button below.</p>
        )}

        {show && <div className="modal-overlay" onClick={handleClose}></div>}

        <Button variant="primary" onClick={handleShow}>
          Add New Event
        </Button>

        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} className="modal-container">
          <Modal.Header closeButton>
            <Modal.Title>New Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAddEvent} className="event-form">
              <div className="form-input-container">
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
                  type="datetime-local"
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
                <input
                  className="form-input"
                  placeholder="Budget"
                  name="budget"
                  type="number"
                  value={formState.budget}
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Guest Count"
                  name="guest_count"
                  type="number"
                  value={formState.guest_count}
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Venue Layout"
                  name="venue_layout"
                  type="text"
                  value={formState.venue_layout}
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Theme"
                  name="theme"
                  type="text"
                  value={formState.theme}
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Food Options"
                  name="food_options"
                  type="text"
                  value={formState.food_options}
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Entertainment"
                  name="entertainment"
                  type="text"
                  value={formState.entertainment}
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Decorations"
                  name="decorations"
                  type="text"
                  value={formState.decorations}
                  onChange={handleChange}
                />
                <textarea
                  className="form-input"
                  placeholder="Details"
                  name="details"
                  value={formState.details}
                  onChange={handleChange}
                />
              </div>
              <button className="btn btn-block btn-info" type="submit">
                Add Event
              </button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Events;

