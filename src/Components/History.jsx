import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndFilterHistory = async () => {
      try {
        const response = await axios.get('http://localhost:8070/history/all');
        console.log('Fetched History:', response.data); // Debugging line
        const allHistory = response.data;

        const filtered = userId
          ? allHistory.filter(item => item.user.userId === userId)
          : [];

        setHistory(allHistory);
        setFilteredHistory(filtered);

        const playlistResponse = await axios.get('http://localhost:8070/playlist/all');
        console.log('Fetched Playlists:', playlistResponse.data); // Debugging line
        const allPlaylists = playlistResponse.data;

        const userPlaylists = allPlaylists.filter(playlist => playlist.user.userId === userId);
        setUserPlaylists(userPlaylists);

      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    // Fetch userId from session storage
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10)); // Convert to number
    }

    fetchAndFilterHistory();
  }, [userId]);

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    navigate('/');
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
                placeholder="Search albums or songs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Buttons (Desktop) */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/explore-premium')}
              className="bg-white text-black rounded-full px-4 py-2 hover:bg-gray-100"
            >
              Explore Premium
            </button>

            {/* Profile Icon */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="focus:outline-none"
              >
                <img
                  src="https://cdn-icons-png.freepik.com/512/7816/7816997.png"
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-gray-600"
                />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 bg-gray-800 text-white p-4 rounded-lg shadow-lg w-48">
                  <div className="flex flex-col space-y-2">
                    <button className="w-full text-left font-semibold hover:bg-gray-700 p-2 rounded">
                      Your Info
                    </button>
                    <button
                      onClick={() => navigate('/history')}
                      className="w-full text-left font-semibold hover:bg-gray-700 p-2 rounded"
                    >
                      History
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 text-white rounded-full py-2 px-4 hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
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
          <h2 className="text-lg font-bold mb-4">Your Library</h2>
          <ul>
            <li className="mb-4">
              <div className="bg-gray-700 p-4 rounded-lg relative">
                <h3 className="text-xl font-semibold mb-2">Playlists</h3>
                <div className="flex flex-col space-y-2">
                  <button
                    className="bg-green-500 text-white rounded-full px-4 py-2 flex items-center hover:bg-green-600"
                    onClick={() => navigate("/playlistuser")}
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Create Playlist
                  </button>
                </div>
              </div>
            </li>

            <li>
              <div className="bg-gray-700 p-4 rounded-lg mt-4">
                <h3 className="text-xl font-semibold mb-2">Your Playlists</h3>
                <div className="flex flex-col space-y-2">
                  {userPlaylists.length > 0 ? (
                    userPlaylists.map((playlist) => (
                      <div key={playlist.playlistId} className="bg-gray-600 p-4 rounded-lg flex items-center cursor-pointer" onClick={() => navigate("/myplaylist")}>
                        <img
                          src={`data:image/jpeg;base64,${playlist.playlistImage}`}
                          alt={playlist.playlistName}
                          className="w-12 h-12 object-cover rounded-full mr-4"
                        />
                        <span className="text-white">{playlist.playlistName}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No playlists available.</p>
                  )}
                </div>
              </div>
            </li>
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-[20%] p-4 overflow-auto bg-gray-900">
          <h1 className="text-2xl font-bold text-gray-100 mb-4">Your History</h1>
          <h2 className="text-xl font-semibold text-white mb-4">Listened Songs</h2>
          {filteredHistory.length > 0 ? (
            <table className="w-full bg-gray-800 text-white">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="py-2 px-4">Song Image</th>
                  <th className="py-2 px-4">Album</th>
                  <th className="py-2 px-4">Song Name</th>
                  <th className="py-2 px-4">Singer</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <React.Fragment key={item.historyId}>
                    {item.songs.map((song) => (
                      <tr key={song.songId} className="border-b border-gray-700">
                        <td className="py-2 px-4">
                          <img 
                            src={`data:image/jpeg;base64,${song.songImage}`} 
                            alt={song.songName} 
                            className="w-16 h-16 object-cover rounded" 
                          />
                        </td>
                        <td className="py-2 px-4">{song.album?.albumName || 'Unknown Album'}</td>
                        <td className="py-2 px-4">{song.songName || 'Unknown Song'}</td>
                        <td className="py-2 px-4">{song.songSinger || 'Unknown Singer'}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400">Loading Histories....</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default History;
