import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { QUERY_EVENT } from '../../utils/queries';
import { ADD_TASK, EDIT_TASK, DELETE_TASK } from '../../utils/mutations';
import { Button, Modal } from 'react-bootstrap';


const TaskDetails = () => {
  const { eventId } = useParams();
  const { loading, data, error, refetch } = useQuery(QUERY_EVENT, {
    variables: { id: eventId },
  });

  const [addTask] = useMutation(ADD_TASK);
  const [editTask] = useMutation(EDIT_TASK);
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: QUERY_EVENT, variables: { id: eventId } }],
  });

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setTaskFormState({
      task_name: '',
      details: '',
      complete: false,
    });
  };

  const handleShow = () => {
    setShow(true);
  };
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [taskFormState, setTaskFormState] = useState({
    task_name: '',
    details: '',
    complete: false,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { event } = data;

  const handleTaskChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaskFormState({
      ...taskFormState,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        await editTask({
          variables: { taskId: currentTaskId, ...taskFormState },
        });
        refetch();
        setShow(false);
      } catch (e) {
        console.error('Error editing task:', e);
      }
    } else {
      try {
        await addTask({
          variables: { ...taskFormState, eventId },
        });
        refetch();
        setShow(false);
      } catch (e) {
        console.error('Error adding task:', e);
      }
    }
    setTaskFormState({ task_name: '', details: '', complete: false });
    setIsEditing(false);
  };

  const handleEditTask = (task) => {
    setTaskFormState({
      task_name: task.task_name,
      details: task.details,
      complete: task.complete,
    });
    setIsEditing(true);
    setCurrentTaskId(task._id);
    setShow(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask({
        variables: { taskId },
      });
      refetch();
    } catch (e) {
      console.error('Error deleting task:', e);
    }
  };

  const handleTaskCompletion = async (task) => {
    try {
      await editTask({
        variables: {
          taskId: task._id,
          task_name: task.task_name,
          details: task.details,
          complete: !task.complete,
        },
      });
      refetch();
    } catch (e) {
      console.error('Error toggling task completion:', e);
    }
  };

  return (
    <div className="task-details-container">
      
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} className="modal-container">
          <Modal.Header closeButton>
            <Modal.Title>New Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleTaskSubmit} className="event-form">
              <div className="form-input-container">
                <input
                  className="form-input"
                  placeholder="Task"
                  name="task_name"
                  type="text"
                  value={setTaskFormState.task_name}
                  onChange={handleTaskChange}
                  required
                />
                <input
                  className="form-input"
                  placeholder="details"
                  name="details"
                  type="text"
                  value={setTaskFormState.details}
                  onChange={handleTaskChange}
                  required
                />
              </div>
              <button className="btn btn-block btn-info" type="submit">
                Add Task
              </button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

      <div className="task-list">
        <ul>
          {event.tasks.map((task) => (
            <li key={task._id}>
              <div className = "task-item">
              <input
                type="checkbox"
                checked={task.complete}
                onChange={() => handleTaskCompletion(task)}
              />
               <span style={{ textDecoration: task.complete ? 'line-through' : 'none' }}>
                {task.task_name} - {task.details}
              </span>
              <div className ="task-buttons">
              <Button variant="outline-secondary" onClick={() => handleEditTask(task)}>
                Edit
              </Button>
              <Button variant="outline-secondary" onClick={() => handleDeleteTask(task._id)}>
                Delete
              </Button>
              </div>
              </div>
            </li>
          ))}
          <Button className = "new-task" variant="primary" onClick={handleShow}>
          Add New Task
      </Button>
        </ul>
      </div>
    </div>
  );
};

export default TaskDetails;
