import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID not found in session storage');
        }

        const response = await axios.get('http://localhost:8070/user/all');
        const users = response.data;

        console.log('Fetched users:', users);
        console.log('User ID from session storage:', userId);

        const currentUser = users.find(user => user.userId === parseInt(userId));
        
        if (!currentUser) {
          throw new Error('User not found');
        }

        setUser(currentUser);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-20">{error}</div>;
  }

  if (!user) {
    return <div className="text-white text-center mt-20">No user data found</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="bg-gray-800 p-4 shadow-md flex items-center justify-between">
        <button
          onClick={handleBack}
          className="text-white hover:text-gray-300 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-white">Profile</h1>
      </div>

      <div className="flex flex-1 flex-col items-center p-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg flex flex-col">
          <div className="flex flex-col items-center mb-6">
            <img
              src="https://png.pngitem.com/pimgs/s/146-1468465_early-signs-of-conception-user-profile-icon-hd.png"
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full mb-4 border-2 border-gray-600"
            />
            <h1 className="text-4xl font-bold mb-4 text-center">Your Name: {user.userName}</h1>
          </div>
          <div className="flex-grow flex flex-col justify-end">
            <p className="text-gray-400 mb-4 text-center"><strong>Gender:</strong> {user.userGender}</p>
            <p className="text-gray-400 mb-4 text-center"><strong>Date of Birth:</strong> {user.userDob}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
