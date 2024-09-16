import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import albumvideo from './albumvideo1.mp4'

const ManageAlbums = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const buttonRef = useRef(null);  // Ref for the Create Playlist button
  const navigate = useNavigate();

  const handleCreatePlaylistClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsLoginModalOpen(false);
  };

  const handleLoginModalOpen = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginRedirect = (path) => {
    handleCloseModal(); // Close the modal before navigating
    navigate(path);
  };

  const handleProfileDropdownToggle = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      navigate('/');
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
                to="/manage-albums"
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
            {/* Add more buttons as needed */}
          </ul>
        </aside>

        <main className="flex-1 ml-[20%] p-4 overflow-auto bg-gray-100">
            <div className="relative w-full h-full">
                {/* Background Div */}
                <div className="absolute inset-0 top-0 mt-3 bg-gray-800 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-6 text-center">Manage Albums</h2>
                <div className="flex flex-col space-y-4 w-4/12 max-w-[40%]">
                    <Link
                    to="/addalbum"
                    className="bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition text-center"
                    >
                    Add New Album
                    </Link>
                    <Link
                    to="/viewalbums"
                    className="bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition text-center"
                    >
                    View Albums
                    </Link>
                </div>
                
                <div className="relative w-full max-w-screen-lg mt-14">
                    <video 
                    autoPlay 
                    loop 
                    muted 
                    className="absolute inset-0 w-full h-72 object-cover rounded-lg"
                    >
                    <source src={albumvideo} type='video/mp4' />
                    </video>
                </div>

                </div>
            </div>
        </main>

      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-80 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <h3 className="text-xl font-semibold mb-4">Select Login Type</h3>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleLoginRedirect('/logincustomer')}
                className="bg-white text-black rounded-full py-2 hover:bg-gray-100"
              >
                Customer Login
              </button>
              <button
                onClick={() => handleLoginRedirect('/loginadmin')}
                className="bg-white text-black rounded-full py-2 hover:bg-gray-100"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAlbums;
