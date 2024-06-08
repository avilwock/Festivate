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
  const [formState, setFormState] = useState({ event_name: '', date: '', location: '' });
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
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
    navigate(`/events/${eventId}`)
  }

  const handleChange = ({ target: { name, value } }) => {
    console.log(value)
    setFormState({
      ...formState,
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  console.log(selectedEvent)


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
                      <p>Date: {event.date ? dayjs(event.date).format('MM/DD/YYYY hh:mm') : 'Invalid Date'}</p>
                    )}
                    {event.location && (
                      <p>Location: {event.location}</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No events found</p>
        )}

        <>
          <Button variant="primary" onClick={handleShow}>
            Add New Event
          </Button>

          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
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
        </>
      </div>
    </div>
  );
};


export default Events;
