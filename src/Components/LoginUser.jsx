import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginUser() {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Fetch all payments
      const paymentResponse = await axios.get('http://localhost:8070/payment/all');
      const payments = paymentResponse.data;

      // Check if the username and password match any premium user
      const payment = payments.find(
        (payment) =>
          payment.user.userName === userName &&
          payment.user.userPassword === userPassword
      );

      if (payment) {
        // If user is found in payment API, navigate to premium page
        toast.success('Login successful! Redirecting to premium page.');
        sessionStorage.setItem('userId', payment.user.userId); // Assuming payment object contains userId
        navigate('/premiumpageuser');
      } else {
        // Fetch all users if not found in payment API
        const userResponse = await axios.get('http://localhost:8070/user/all');
        const users = userResponse.data;

        // Find the user with matching username and password
        const user = users.find(
          (user) =>
            user.userName === userName && user.userPassword === userPassword
        );

        if (user) {
          // Store user ID in session storage
          sessionStorage.setItem('userId', user.userId);

          // Navigate to home page if user credentials are valid
          toast.success('Login successful! Redirecting to home page.');
          navigate('/homepageuser');
        } else {
          // Display error message for invalid credentials
          toast.error('Invalid username or password.');
        }
      }
    } catch (error) {
      // Handle errors
      toast.error('Error during login. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300">Username</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-700 rounded bg-gray-900 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-700 rounded bg-gray-900 text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-2xl hover:bg-green-700"
          >
            Login
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LoginUser;
