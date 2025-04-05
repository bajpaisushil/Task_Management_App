import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Task Manager</Link>
        
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">Hello, {user?.username}</span>
            <button 
              onClick={handleLogout}
              className="px-3 py-1 bg-white text-indigo-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-2">
            <Link 
              to="/login"
              className="px-3 py-1 bg-white text-indigo-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register"
              className="px-3 py-1 border border-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
