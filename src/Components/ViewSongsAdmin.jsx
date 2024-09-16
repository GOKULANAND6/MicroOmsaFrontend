import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ViewSongsAdmin = () => {
  const { albumId } = useParams();
  const [songs, setSongs] = useState([]);
  const [playingSong, setPlayingSong] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('http://localhost:8070/song/all');
        const allSongs = response.data;
        const filteredSongs = allSongs.filter(song => song.album && song.album.albumId.toString() === albumId.toString());
        setSongs(filteredSongs);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
  }, [albumId]);

  const handleSelectSong = (song) => {
    setPlayingSong({
      songId: song.songId,
      name: song.songName,
      singer: song.songSinger,
      songMp3: song.songMp3,
      songImage: song.songImage
    });
  };

  useEffect(() => {
    if (playingSong && audioRef.current) {
      audioRef.current.play();
    }
  }, [playingSong]);

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
                  onClick={() => setIsPlaylistModalOpen(true)}
                  className="block w-full bg-white text-black text-center py-2 rounded-full hover:bg-gray-200"
                >
                  Create Playlist
                </button>
                {isPlaylistModalOpen && (
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
                        onClick={() => { setIsPlaylistModalOpen(false); setIsLoginModalOpen(false); }}
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
          <h2 className="text-2xl font-bold mb-6">Songs</h2>

          {/* Add Song Button */}
          <div className="mb-6">
            <Link
              to={`/addsong/${albumId}`}
              className="inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-400 transition-colors duration-300"
            >
              <i className="fas fa-plus mr-2"></i>Add Song
            </Link>
          </div>

          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-transparent border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="py-2 px-4 text-left">Play</th>
                    <th className="py-2 px-4 text-left">Song</th>
                    <th className="py-2 px-4 text-left">Singer</th>
                  </tr>
                </thead>
                <tbody>
                  {songs.length > 0 ? (
                    songs.map((song) => (
                      <tr key={song.songId} className="bg-gray-700 hover:bg-gray-600">
                        <td className="py-2 px-4">
                          <button
                            onClick={() => handleSelectSong(song)}
                            className="text-white font-bold py-2 px-2 rounded-full bg-transparent hover:bg-gray-600 transition-colors duration-300"
                          >
                            <i className="fa fa-play" style={{ fontSize: '20px' }}></i>
                          </button>
                        </td>
                        <td className="py-2 px-4 flex items-center space-x-4">
                          <img
                            src={`data:image/jpeg;base64,${song.songImage}`}
                            alt={song.songName}
                            className="w-14 h-14 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-white">{song.songName}</h3>
                            <p className="text-gray-300">Singer: {song.songSinger}</p>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <p className="text-gray-300">{song.songSinger}</p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-white py-4">Loading Songs....</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Playing Song Player */}
          {playingSong && (
            <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between border-t border-gray-700">
              <div className="flex items-center">
                <img
                  src={`data:image/jpeg;base64,${playingSong.songImage}`}
                  alt={playingSong.name}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{playingSong.name}</h3>
                  <p className="text-gray-400">Singer: {playingSong.singer}</p>
                </div>
              </div>
              <audio ref={audioRef} controls className="w-1/2">
                <source src={`data:audio/mp3;base64,${playingSong.songMp3}`} type="audio/mp3" />
                Your browser does not support the <code>audio</code> element.
              </audio>
              <button
                onClick={() => setPlayingSong(null)}
                className="text-gray-400 hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          )}

          {/* Login Modal */}
          {isLoginModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
              <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-80">
                <h3 className="text-xl font-semibold mb-4">Log In</h3>
                <form className="flex flex-col">
                  <label className="mb-2">
                    Username:
                    <input type="text" className="w-full p-2 mt-1 bg-gray-700 rounded" />
                  </label>
                  <label className="mb-4">
                    Password:
                    <input type="password" className="w-full p-2 mt-1 bg-gray-700 rounded" />
                  </label>
                  <button
                    type="submit"
                    className="bg-green-500 text-white py-2 rounded hover:bg-green-400"
                  >
                    Log In
                  </button>
                </form>
                <button
                  onClick={() => setIsLoginModalOpen(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewSongsAdmin;
