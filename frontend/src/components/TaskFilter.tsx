interface TaskFilterProps {
    filter: string;
    setFilter: (filter: string) => void;
  }
  
  const TaskFilter = ({ filter, setFilter }: TaskFilterProps) => {
    return (
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('TODO')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'TODO'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            To Do
          </button>
          <button
            onClick={() => setFilter('IN_PROGRESS')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'IN_PROGRESS'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'COMPLETED'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
    );
  };
  
  export default TaskFilter;
  