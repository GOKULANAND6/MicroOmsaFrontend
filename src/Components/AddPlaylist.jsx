import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddPlaylist = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    playlistName: '',
    playlistImage: null,
    userId: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
             
          setFormData((prevState) => ({ 
            ...prevState, 
            userId: userId
          }));
        } else {
          toast.error('User not logged in.');
          navigate('/');
        }
      } catch (error) {
        toast.error('Error fetching user details.');
        navigate('/');
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleProfileDropdownToggle = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      sessionStorage.removeItem('userId');
      navigate('/');
    }
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('playlistName', formData.playlistName);
    data.append('userId', formData.userId);
    if (formData.playlistImage) {
      data.append('playlistImage', formData.playlistImage);
    }
  
    // Do not append songId if it's not needed initially
    // data.append('songId', JSON.stringify([])); // Omit this line
  
    try {
      await axios.post('http://localhost:8070/playlist/add', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Playlist added successfully!');
      navigate('/homepageuser');
    } catch (error) {
      console.error('Error adding playlist:', error.response.data);
      toast.error('Error adding playlist.');
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Navbar */}
      <nav className="bg-black text-white shadow-lg rounded fixed w-full top-0 left-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-green-500 hover:text-green-400">
              GoMusicStore
            </Link>
          </div>

          <div className="flex-1 flex justify-center mx-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a7 7 0 100 14 7 7 0 000-14zm0 0l6 6"></path>
              </svg>
            </div>
          </div>

          {/* Profile Icon and Dropdown */}
          <div className="relative">
            <button
              onClick={handleProfileDropdownToggle}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 text-white hover:bg-gray-600"
            >
              {/* Display first letter of admin's name */}
              G
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 bg-gray-800 text-white mt-2 w-48 rounded-lg shadow-lg">
                <div className="py-2">
                  <button
                    onClick={() => navigate('/your-info')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Your Info
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white hover:text-gray-300 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 mt-16">
        {/* Sidebar */}
        <aside className="w-1/5 bg-black text-white border-r border-gray-700 p-4 fixed top-16 bottom-0">
          <h2 className="text-lg font-bold mb-4">Admin Dashboard</h2>
          <ul>
            <li className="mb-4">
              <Link
                to="/managealbums"
                className="block bg-gray-700 p-4 rounded-lg hover:bg-gray-600"
              >
                <h3 className="text-xl font-semibold mb-2">Manage Albums</h3>
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/manageartists"
                className="block bg-gray-700 p-4 rounded-lg hover:bg-gray-600"
              >
                <h3 className="text-xl font-semibold mb-2">Manage Artists</h3>
              </Link>
            </li>
          </ul>
        </aside>

        <main className="flex-1 ml-[20%] p-4 overflow-auto bg-gray-100">
          <div className="relative w-full max-w-screen-lg mx-auto mt-24">
            <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-center text-green-500">Add New Playlist</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="playlistName" className="block text-lg font-medium mb-2">Playlist Name</label>
                  <input
                    type="text"
                    id="playlistName"
                    value={formData.playlistName}
                    onChange={(e) =>
                      setFormData((prevState) => ({ ...prevState, playlistName: e.target.value }))
                    }
                    required
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="playlistImage" className="block text-lg font-medium mb-2">Playlist Image</label>
                  <input
                    type="file"
                    id="playlistImage"
                    name="playlistImage"
                    onChange={handleImageChange}
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                    accept="image/*"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Add Playlist
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddPlaylist;
