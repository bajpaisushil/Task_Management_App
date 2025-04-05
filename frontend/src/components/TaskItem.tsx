import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { Task, deleteTask, setCurrentTask } from '../store/taskSlice';
import TaskForm from './TaskForm';

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    dispatch(setCurrentTask(task));
    setIsEditOpen(true);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteTask(task.id)).unwrap();
      } catch (error) {
        console.error('Failed to delete task:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <>
      <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 bg-white">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{task.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm">{task.description || 'No description provided.'}</p>
        
        <div className="text-xs text-gray-500 mb-4">
          Created: {formatDate(task.createdAt)}
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleEdit}
            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors text-sm"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <TaskForm 
        isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false);
          dispatch(setCurrentTask(null));
        }} 
        isEditing={true}
      />
    </>
  );
};

export default TaskItem;
