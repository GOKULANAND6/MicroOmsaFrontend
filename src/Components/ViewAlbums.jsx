import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch albums on component mount
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get('http://localhost:8070/album/all');
        setAlbums(response.data);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };

    fetchAlbums();
  }, []);

  const handleViewSongsClick = (albumId) => {
    navigate(`/viewsongs/${albumId}`);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Navbar */}
      <nav className="bg-black text-white shadow-lg rounded fixed w-full top-0 left-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
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
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/signup" className="text-gray-300 hover:text-gray-100">Sign Up</Link>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-white text-black rounded-full px-4 py-2 hover:bg-gray-200"
            >
              Log In
            </button>
          </div>
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
          <h2 className="text-lg font-bold mb-4">Your Library</h2>
          <ul>
            <li className="mb-4">
              <div className="bg-gray-700 p-4 rounded-lg relative">
                <h3 className="text-xl font-semibold mb-2">Create your First Playlist</h3>
                <p className="mb-4">It's easy. We will help you</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="block w-full bg-white text-black text-center py-2 rounded-full hover:bg-gray-200"
                >
                  Create Playlist
                </button>
                {isModalOpen && (
                  <div className="absolute bg-gray-800 text-white p-4 rounded-lg shadow-lg w-80"
                       style={{ top: '50%', left: '100%', marginLeft: '10px', transform: 'translateY(-50%)', zIndex: 20 }}>
                    <div className="absolute top-1/2 left-[-10px] transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-t-gray-100"></div>
                    <h3 className="text-xl font-semibold mb-2">Please Log In</h3>
                    <p className="mb-4">You need to be logged in to create a playlist. Please log in or sign up to continue.</p>
                    <div className="flex justify-between">
                      <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="bg-white text-black rounded-full px-4 py-2 hover:bg-gray-200"
                      >
                        OK
                      </button>
                      <button
                        onClick={() => { setIsModalOpen(false); setIsLoginModalOpen(false); }}
                        className="bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-600"
                      >
                        Not Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </li>
            <li className="mb-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Let's find some Podcasts</h3>
                <p className="mb-4">We'll keep you updated on new Episodes</p>
                <Link
                  to="/manage-playlists"
                  className="block w-full bg-white text-black text-center py-2 rounded-full hover:bg-gray-200"
                >
                  Browse Podcasts
                </Link>
              </div>
            </li>
          </ul>
        </aside>

        <main className="flex-1 ml-[20%] p-4 overflow-auto bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">View Albums</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {albums.map((album) => (
              <div
                key={album.albumId}
                className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center"
              >
                <img
                  src={`data:image/jpeg;base64,${album.albumImage}`}
                  alt={album.albumName}
                  className="w-full h-60 object rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2 text-center text-gray-100">{album.albumName}</h3>
                <p className="text-gray-400 mb-4 text-center">Music Director: {album.musicDirector}</p>
                <button
                  onClick={() => handleViewSongsClick(album.albumId)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
                >
                  View Songs
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-80 relative">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <h3 className="text-xl font-semibold mb-4">Select Login Type</h3>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => navigate('/logincustomer')}
                className="bg-white text-black rounded-full py-2 hover:bg-gray-100"
              >
                Customer Login
              </button>
              <button
                onClick={() => navigate('/loginadmin')}
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

export default ViewAlbums;
