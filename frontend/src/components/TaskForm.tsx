import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { createTask, updateTask } from '../store/taskSlice';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing?: boolean;
}

const TaskForm = ({ isOpen, onClose, isEditing = false }: TaskFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentTask, loading } = useSelector((state: RootState) => state.tasks);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'COMPLETED'>('TODO');

  useEffect(() => {
    if (isEditing && currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description);
      setStatus(currentTask.status);
    } else {
      resetForm();
    }
  }, [isEditing, currentTask, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('TODO');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentTask) {
        await dispatch(updateTask({
          id: currentTask.id,
          title,
          description,
          status
        })).unwrap();
      } else {
        await dispatch(createTask({
          title,
          description,
          status
        })).unwrap();
      }
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-60" onClick={onClose}></div>
      
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative z-10">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'TODO' | 'IN_PROGRESS' | 'COMPLETED')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;