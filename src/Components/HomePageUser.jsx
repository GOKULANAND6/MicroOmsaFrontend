import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePageUser = () => {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State for profile dropdown
  const [userId, setUserId] = useState(null); // State for user ID
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the userId from session storage
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10)); // Convert to number
    }

    const fetchAlbumsAndPlaylists = async () => {
      try {
        const albumResponse = await axios.get('http://localhost:8070/album/all');
        setAlbums(albumResponse.data);

        const playlistResponse = await axios.get('http://localhost:8070/playlist/all');
        setPlaylists(playlistResponse.data);

        const songResponse = await axios.get('http://localhost:8070/song/all');
        setSongs(songResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAlbumsAndPlaylists();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  // Filter playlists by userId
  const userPlaylists = playlists.filter(playlist => playlist.user.userId === userId);

  // Filter albums and songs based on the search query
  const filteredAlbums = albums.filter(album =>
    album.albumName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSongs = songs.filter(song =>
    (song.songName?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );
  
  // Determine which results to show based on the search query
  const searchIsForAlbum = filteredAlbums.length > 0;
  const searchIsForSong = filteredSongs.length > 0;

  // Get all songs from the filtered albums
  const songsFromFilteredAlbums = filteredAlbums.flatMap(album =>
    songs.filter(song => song.albumId === album.albumId)
  );

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
              onClick={() => navigate('/premiumuser')}
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
                    <button className="w-full text-left font-semibold hover:bg-gray-700 p-2 rounded" onClick={() => navigate('/profile')}>
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
          {searchQuery && (
            <div>
              {searchIsForAlbum && (
                <div>
                  <h2 className="text-xl font-bold text-gray-100 mt-8 mb-4">Album: {filteredAlbums[0]?.albumName}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {filteredAlbums.map((album) => (
                      <div key={album.albumId} className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                        <img
                          src={`data:image/jpeg;base64,${album.albumImage}`}
                          alt={album.albumName}
                          className="w-full h-40 object-cover"
                        />
                        <button
                          onClick={() => navigate('/viewsongshome', { state: { album } })}
                          className="absolute bottom-14 right-4 bg-green-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-green-700 transition-colors duration-300"
                        >
                          <i className="fa fa-play" style={{ fontSize: '20px' }}></i>
                        </button>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-white">{album.albumName}</h3>
                          <p className="text-gray-400">Music Director: {album.musicDirector}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {songsFromFilteredAlbums.length > 0 ? (
                      songsFromFilteredAlbums.map((song) => (
                        <div key={song.songId} className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                          <img
                            src={`data:image/jpeg;base64,${song.songImage}`}
                            alt={song.songName}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-white">{song.songName}</h3>
                            <p className="text-gray-400">Singer: {song.songSinger}</p>
                          </div>
                          <button
                            onClick={() => navigate('/viewsongdetails', { state: { song } })}
                            className="absolute bottom-4 right-4 bg-green-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-green-700 transition-colors duration-300"
                          >
                            <i className="fa fa-info-circle" style={{ fontSize: '20px' }}></i>
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400"></p>
                    )}
                  </div>
                </div>
              )}

              {searchIsForSong && !searchIsForAlbum && (
                <div>
                  <h2 className="text-xl font-bold text-gray-100 mt-8 mb-4">Songs</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredSongs.map((song) => (
                      <div key={song.songId} className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                        <img
                          src={`data:image/jpeg;base64,${song.songImage}`}
                          alt={song.songName}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-white">{song.songName}</h3>
                          <p className="text-gray-400">Singer: {song.songSinger}</p>
                        </div>
                        <button
                          onClick={() => navigate('/viewsongdetails', { state: { song } })}
                          className="absolute bottom-4 right-4 bg-green-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-green-700 transition-colors duration-300"
                        >
                          <i className="fa fa-info-circle" style={{ fontSize: '20px' }}></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!searchQuery && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-100">Popular Albums</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 z-50">
                {albums.length > 0 ? (
                  albums.map((album) => (
                    <div key={album.albumId} className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={`data:image/jpeg;base64,${album.albumImage}`}
                        alt={album.albumName}
                        className="w-full h-40 object-cover"
                      />
                      <button
                        onClick={() => navigate('/viewsongshome', { state: { album } })}
                        className="absolute bottom-14 right-4 bg-green-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-green-700 transition-colors duration-300"
                      >
                        <i className="fa fa-play" style={{ fontSize: '20px' }}></i>
                      </button>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white">{album.albumName}</h3>
                        <p className="text-gray-400">Music Director: {album.musicDirector}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No albums found.</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePageUser;
