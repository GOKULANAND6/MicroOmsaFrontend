import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const ViewSongsHome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState(new Set()); // Updated state
  const [playingSong, setPlayingSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [artistDetails, setArtistDetails] = useState(null);
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [likedSongs, setLikedSongs] = useState();
  const [currentProgress, setCurrentProgress] = useState();
  const [inputData, setInputData] = useState({
    playlistId: '',
    songId: ''
  });

  const audioRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const albumData = location.state?.album;
    setAlbum(albumData);

    if (albumData) {
      const fetchSongs = async () => {
        try {
          const response = await axios.get('http://localhost:8070/song/all');
          const allSongs = response.data;
          const filteredSongs = allSongs.filter(song => song.album?.albumId === albumData.albumId);
          setSongs(filteredSongs);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching songs:', error);
          setLoading(false);
        }
      };

      fetchSongs();
    }
  }, [location.state?.album]);

  useEffect(() => {
    if (playingSong && audioRef.current) {
      audioRef.current.src = `data:audio/mp3;base64,${playingSong.songMp3}`;
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [playingSong]);

  const handleSelectSong = async (song) => {
    const updatedSelectedSongs = new Set(selectedSongs);
    if (updatedSelectedSongs.has(song.songId)) {
      updatedSelectedSongs.delete(song.songId);
    } else {
      updatedSelectedSongs.add(song.songId);
    }
    setSelectedSongs(updatedSelectedSongs);
  
    if (playingSong && playingSong.songId === song.songId) {
      setPlayingSong(null);
    } else {
      setPlayingSong({
        songId: song.songId,
        name: song.songName,
        singer: song.songSinger,
        songMp3: song.songMp3,
        songImage: song.songImage
      });
    }
  
    try {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID is not available in sessionStorage.');
      }
  
      // Assuming the server expects a list of song IDs
      const response = await axios.post(`http://localhost:8070/history/add/${userId}`, Array.from(updatedSelectedSongs));
      console.log('History record added successfully:', response.data);
    } catch (error) {
      console.error('Error adding history record:', error.response ? error.response.data : error.message);
    }
  };
  

  const handleOpenAddToPlaylistModal = async () => {
    try {
      const response = await axios.get('http://localhost:8070/playlist/all');
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
    setIsAddToPlaylistModalOpen(true);
  };

  const handleAddToPlaylist = async () => {
    if (inputData.playlistId && inputData.songId) {
      try {
        const response = await axios.put(`http://localhost:8070/playlist/${inputData.playlistId}/addSongs/${inputData.songId}`);
        console.log('Response:', response.data);
        setIsAddToPlaylistModalOpen(false);
        setInputData({ playlistId: '', songId: '' });
      } catch (error) {
        console.error('Error adding song to playlist:', error.response ? error.response.data : error.message);
      }
    } else {
      console.error('Selected playlist or song is missing');
    }
  };

  const handleLikeSong = (songId) => {
    setLikedSongs((prev) => {
      const updatedLikes = new Set(prev);
      if (updatedLikes.has(songId)) {
        updatedLikes.delete(songId);
      } else {
        updatedLikes.add(songId);
      }
      return updatedLikes;
    });
  };

  const fetchArtistDetails = async (musicDirector) => {
    try {
      const response = await axios.get('http://localhost:8070/artist/all');
      const artists = response.data;
      const artist = artists.find(artist => artist.artistName === musicDirector);
      if (artist) {
        setArtistDetails(artist);
        setIsArtistModalOpen(true);
      } else {
        console.error('Artist not found');
      }
    } catch (error) {
      console.error('Error fetching artist details:', error);
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;

    const updateProgress = () => {
      if (audioElement) {
        const progress = (audioElement.currentTime / audioElement.duration) * 100;
        setCurrentProgress(progress);
      }
    };

    // Update progress every second
    const interval = setInterval(updateProgress, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [playingSong]);

  return (
    <div className="flex flex-col min-h-screen relative bg-black text-white">

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

        <aside className="w-1/5 bg-gray-900 text-white border-r border-gray-700 p-4 fixed top-16 bottom-0">
          <h2 className="text-lg font-bold mb-4">Your Library</h2>
          <ul>
            <li className="mb-4">
              <div className="bg-gray-800 p-4 rounded-lg relative">
                <h3 className="text-xl font-semibold mb-2">Create your First Playlist</h3>
                <p className="mb-4">It's easy. We will help you</p>
                <button
                  onClick={handleOpenAddToPlaylistModal}
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
                        onClick={() => setIsModalOpen(false)}
                        className="bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </aside>

        <main className="w-4/5 p-4 ml-auto bg-gray-900">

          {album && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex mb-6">
                <img
                  src={`data:image/jpeg;base64,${album.albumImage}`}
                  alt={album.albumName}
                  className="w-40 h-40 object-cover rounded-lg mr-4"
                />
                <div className="flex flex-col justify-center">
                  <h1 className="text-8xl font-bold">{album.albumName}</h1>
                  <p 
                    className="text-2xl text-gray-400 cursor-pointer"
                    onClick={() => fetchArtistDetails(album.musicDirector)}
                  >
                    Music Director: {album.musicDirector}
                  </p>
                </div>
              </div>
              <hr className="my-6 border-gray-600" />

              {loading ? (
                <p>Loading songs...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">Song</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">Song</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">Singer</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">Play</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">Playlist</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800">
                      {songs.map((song) => (
                        <tr key={song.songId} className="border-b border-gray-700">
                          <td className="px-4 py-2">
                            <img
                              src={`data:image/jpeg;base64,${song.songImage}`}
                              alt={song.songName}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          </td>
                          <td className="px-4 py-2 text-gray-100">{song.songName}</td>
                          <td className="px-4 py-2 text-gray-400">{song.songSinger}</td>
                          <td className="px-4 py-2 flex space-x-2">
                            <button
                              onClick={() => handleSelectSong(song)}
                              className="text-white px-4 py-2 flex items-center mt-2 justify-center"
                            >
                              {playingSong?.songId === song.songId ? (
                                <i className="fas fa-pause" style={{ fontSize: '20px' }}></i>
                              ) : (
                                <i className="fas fa-play" style={{ fontSize: '20px' }}></i>
                              )}
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                setInputData(prevData => ({
                                  ...prevData,
                                  songId: song.songId
                                }));
                                handleOpenAddToPlaylistModal();
                              }}
                              className="bg-transparent border-none p-0"
                            >
                              <img
                                src='https://cdn3d.iconscout.com/3d/premium/thumb/add-playlist-11870456-9764060.png'
                                alt="Add to Playlist"
                                className="w-14 h-14"
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {playingSong && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 flex items-center justify-between border-t border-gray-700">
          <div className="flex items-center space-x-4">
            <img
              src={`data:image/jpeg;base64,${playingSong.songImage}`}
              alt={playingSong.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-semibold">{playingSong.name}</h3>
              <p className="text-sm text-gray-400">{playingSong.singer}</p>
            </div>
          </div>
          <audio ref={audioRef} controls className="flex-1 mx-4"  ></audio>
          <input type="range" min="0" max="100" value={currentProgress} class="w-full bg-gray-300 cursor-not-allowed" disabled />
        </div>
      )}

      {isAddToPlaylistModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-80 relative">
            <button
              onClick={() => { setIsAddToPlaylistModalOpen(false); }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <h3 className="text-xl font-semibold mb-4">Add to Playlist</h3>
            <select
              onChange={(e) => setInputData(prevData => ({
                ...prevData,
                playlistId: e.target.value
              }))}
              className="w-full mb-4 bg-gray-700 text-white p-2 rounded"
              value={inputData.playlistId || ""}
            >
              <option value="">Select Playlist</option>
              {playlists.map((playlist) => (
                <option key={playlist.playlistId} value={playlist.playlistId}>
                  {playlist.playlistName}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleAddToPlaylist}
                className="bg-green-500 text-white rounded-full px-4 py-2 hover:bg-green-600"
              >
                Add
              </button>
              <button
                onClick={() => { setIsAddToPlaylistModalOpen(false); }}
                className="bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-80">
            <h3 className="text-xl font-semibold mb-4">Log In</h3>
            <input
              type="text"
              placeholder="Username"
              className="w-full mb-4 p-2 rounded bg-gray-700"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 p-2 rounded bg-gray-700"
            />
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600"
            >
              Log In
            </button>
          </div>
        </div>
      )}

      {isArtistModalOpen && artistDetails && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gray-800 text-white p-8 rounded-lg w-full max-w-lg relative">
              <button
                  onClick={() => setIsArtistModalOpen(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                <div className="flex flex-col items-center">
                  <img
                    src={`data:image/jpeg;base64,${artistDetails.artistImage}`}
                    alt={artistDetails.artistName}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-2xl font-semibold mb-4 text-center">{artistDetails.artistName}</h3>
                  <p className="text-center mb-4">{artistDetails.dob}</p>
                  <p className="text-center mb-4">{artistDetails.bio}</p>
                  <p className="text-center mb-4">Specialist in {artistDetails.specialization}</p>   
                </div>
              </div>
            </div>
            )}
    </div>
  );
};

export default ViewSongsHome;
