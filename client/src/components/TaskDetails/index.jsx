// client/src/components/TaskDetails/index.jsx
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { QUERY_EVENT } from '../../utils/queries';
import { ADD_TASK, EDIT_TASK, DELETE_TASK } from '../../utils/mutations';
import { useState } from 'react';

const TaskDetails = () => {
  const { eventId } = useParams();
  const { loading, data, error, refetch } = useQuery(QUERY_EVENT, {
    variables: { id: eventId },
  });

  const [addTask] = useMutation(ADD_TASK);
  const [editTask] = useMutation(EDIT_TASK);
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [QUERY_EVENT, "event"]
  });
  const [taskFormState, setTaskFormState] = useState({ task_name: '', details: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { event } = data;

  const handleTaskChange = ({ target: { name, value } }) => {
    setTaskFormState({
      ...taskFormState,
      [name]: value,
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
      } catch (e) {
        console.error('Error editing task:', e);
      }
    } else {
      try {
        await addTask({
          variables: { ...taskFormState, eventId },
        });
        refetch();
      } catch (e) {
        console.error('Error adding task:', e);
      }
    }
    setTaskFormState({ task_name: '', details: '' });
    setIsEditing(false);
  };

  const handleEditTask = (task) => {
    setTaskFormState({ task_name: task.task_name, details: task.details });
    setIsEditing(true);
    setCurrentTaskId(task._id);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask({
        variables: { taskId },
      });
      /* refetch();*/
    } catch (e) {
      console.error('Error deleting task:', e);
    }
  };

  return (
    <div className="task-details-container">
      <div className="task-form">
        <h3>Tasks</h3>
        <form onSubmit={handleTaskSubmit} className="form-input-container">
          <input
            type="text"
            name="task_name"
            value={taskFormState.task_name}
            onChange={handleTaskChange}
            placeholder="Task Name"
            required
            className="form-input"
          />
          <input
            type="text"
            name="details"
            value={taskFormState.details}
            onChange={handleTaskChange}
            placeholder="Details"
            className="form-input"
          />
          <button type="submit">{isEditing ? 'Save Task' : 'Add Task'}</button>
        </form>
      </div>
      <div className="task-list">
        <ul>
          {event.tasks.map((task) => (
            <li key={task._id}>
              <span style={{ textDecoration: task.complete ? 'line-through' : 'none' }}>
                {task.task_name} - {task.details}
              </span>
              <button onClick={() => handleEditTask(task)}>Edit</button>
              <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskDetails;
