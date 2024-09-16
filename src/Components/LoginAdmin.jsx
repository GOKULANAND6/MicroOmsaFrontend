import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    adminName: '',
    adminPassword: '',
  });
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8070/admin/all');
        setRegisteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching registered users data:', error);
        toast.error('Failed to fetch users. Please try again later.', {
          icon: <FaExclamationTriangle />,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { adminName, adminPassword } = inputData;

    const user = registeredUsers.find(
      (user) => user.adminName === adminName && user.adminPassword === adminPassword
    );

    if (user) {
      toast.success('Login Successful. You have logged in successfully.', {
        icon: <FaCheckCircle />,
        onClose: () => navigate('/homepageadmin'),
      });
    } else {
      toast.error('Invalid credentials. Please check your username and password and try again.', {
        icon: <FaExclamationTriangle />,
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <div className="bg-gray-100 text-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              id="name"
              className="w-full p-2 rounded-lg bg-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your name"
              required
              value={inputData.adminName}
              onChange={(e) => setInputData({ ...inputData, adminName: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 rounded-lg bg-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
              required
              value={inputData.adminPassword}
              onChange={(e) => setInputData({ ...inputData, adminPassword: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
