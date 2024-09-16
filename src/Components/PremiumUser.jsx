import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PremiumUser = () => {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [premiumOptions, setPremiumOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }

    const fetchAlbumsAndPlaylists = async () => {
      try {
        const albumResponse = await axios.get('http://localhost:8070/album/all');
        setAlbums(albumResponse.data);

        const playlistResponse = await axios.get('http://localhost:8070/playlist/all');
        setPlaylists(playlistResponse.data);

        const songResponse = await axios.get('http://localhost:8070/song/all');
        setSongs(songResponse.data);

        const premiumResponse = await axios.get('http://localhost:8070/premium/all');
        setPremiumOptions(premiumResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAlbumsAndPlaylists();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const userPlaylists = playlists.filter(playlist => playlist.user.userId === userId);

  const filteredAlbums = albums.filter(album =>
    album.albumName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSongs = songs.filter(song =>
    song.songName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define an array of unique background colors
  const bgColors = [
    'bg-red-500', 'bg-green-500', 'bg-blue-500',
    'bg-yellow-500', 'bg-pink-500', 'bg-purple-500'
  ];

  // Add a background color to each premium option
  const coloredPremiumOptions = premiumOptions.map((option, index) => ({
    ...option,
    bgColor: bgColors[index % bgColors.length] // Cycle through the colors
  }));

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
                      <div key={playlist.playlistId} className="bg-gray-600 p-4 rounded-lg flex items-center" onClick={() => navigate("/myplaylist")} style={{cursor: 'pointer'}}>
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

        <main className="flex-1 ml-[20%] p-4 overflow-auto bg-gray-900">
          <h2 className="text-2xl font-bold text-white mb-4">Premium Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coloredPremiumOptions.length > 0 ? (
              coloredPremiumOptions.map(option => (
                <div
                  key={option.premiumId}
                  className={`text-white p-6 rounded-lg shadow-lg ${option.bgColor}`}
                >
                  <h3 className="text-2xl font-semibold mb-2">{option.premiumName}</h3>
                  <p className="text-gray-200 mb-2">Validity: {option.premiumvalidity}</p>
                  <p className="text-gray-100 text-3xl font-bold mb-4">{option.premiumPrice}</p>
                  <p className="text-gray-300 mb-4">{option.premiumDescription}</p>
                  <button
                    onClick={() => navigate(`/payment/${option.premiumId}`)}
                    className="mt-4 bg-white text-black rounded-full px-4 py-2 hover:bg-gray-100"
                  >
                    Choose Plan
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Loading Premiums....</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PremiumUser;
