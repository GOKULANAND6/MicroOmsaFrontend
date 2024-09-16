import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const MyPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playingSong, setPlayingSong] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [songQueue, setSongQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('http://localhost:8070/playlist/all');
        setPlaylists(response.data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const handlePlaySong = (song) => {
    setPlayingSong({
      songId: song.songId,
      songName: song.songName,
      songSinger: song.songSinger,
      songMp3: song.songMp3,
      songImage: song.songImage
    });
    if (audioRef.current) {
      audioRef.current.src = `data:audio/mp3;base64,${song.songMp3}`;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    if (playingSong && audioRef.current) {
      audioRef.current.play();
    }
  }, [playingSong]);

  const getDurationFromBase64 = (base64Data) => {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const dataUrl = `data:audio/mp3;base64,${base64Data}`;
      fetch(dataUrl)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          resolve(audioBuffer.duration);
        })
        .catch(error => reject(error));
    });
  };

  const getTotalDuration = async (songs) => {
    if (!songs || songs.length === 0) return 0;

    let totalDuration = 0;
    for (const song of songs) {
      try {
        const duration = await getDurationFromBase64(song.songMp3);
        totalDuration += duration;
      } catch (error) {
        console.error('Error getting duration for song:', error);
      }
    }
    return totalDuration;
  };

  useEffect(() => {
    if (selectedPlaylist) {
      const calculateTotalDuration = async () => {
        const durationInSeconds = await getTotalDuration(selectedPlaylist.songs);
        setTotalDuration(durationInSeconds);
      };

      calculateTotalDuration();
    }
  }, [selectedPlaylist]);

  const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleBackToPlaylists = () => {
    setSelectedPlaylist(null);
  };

  const handlePlayAll = () => {
    if (selectedPlaylist && selectedPlaylist.songs.length > 0) {
      setIsPlayingAll(true);
      const queue = [...selectedPlaylist.songs];
      setSongQueue(queue);
      setCurrentIndex(0);
      playNextSong(queue, 0);
    }
  };

  const playNextSong = (queue, index) => {
    if (index >= queue.length) {
      setIsPlayingAll(false);
      return;
    }
  
    const song = queue[index];
    setPlayingSong({
      songId: song.songId,
      songName: song.songName,
      songSinger: song.songSinger,
      songMp3: song.songMp3,
      songImage: song.songImage
    });
  
    if (audioRef.current) {
      audioRef.current.src = `data:audio/mp3;base64,${song.songMp3}`;
      audioRef.current.play().catch(error => {
        console.error('Error playing song:', error);
      });
    }
  };

  useEffect(() => {
    const handleAudioEnded = () => {
      if (isPlayingAll && currentIndex < songQueue.length - 1) {
        setCurrentIndex(currentIndex + 1);
        playNextSong(songQueue, currentIndex + 1);
      } else {
        setIsPlayingAll(false);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [currentIndex, isPlayingAll, songQueue]);
  
  return (
    <div className="flex flex-col min-h-screen relative">
      <nav className="bg-black text-white shadow-lg rounded fixed w-full top-0 left-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-green-500 hover:text-green-400">
            GoMusicStore
          </Link>

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

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/explore-premium')}
              className="bg-white text-black rounded-full px-4 py-2 hover:bg-gray-100"
            >
              Explore Premium
            </button>

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

          <button className="md:hidden text-white hover:text-gray-300 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 mt-16">
        <aside className="w-1/5 bg-black text-white border-r border-gray-700 p-4 fixed top-16 bottom-0">
          <h2 className="text-lg font-bold mb-4">Your Library</h2>
          <ul>
            <li className="mb-4">
              <div className="bg-gray-700 p-4 rounded-lg relative">
                <h3 className="text-xl font-semibold mb-2">Playlists</h3>
                <div className="flex flex-col space-y-2">
                  <button
                    className="bg-green-500 text-white rounded-full px-4 py-2 flex items-center hover:bg-green-600"
                    onClick={() => navigate('/create-playlist')}
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
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.playlistId}
                      className="bg-gray-600 p-4 rounded-lg flex items-center cursor-pointer hover:bg-gray-500"
                      onClick={() => handlePlaylistClick(playlist)}
                    >
                      <img
                        src={`data:image/jpeg;base64,${playlist.playlistImage}`}
                        alt={playlist.playlistName}
                        className="w-12 h-12 object-cover rounded-full mr-4"
                      />
                      <span className="text-white">{playlist.playlistName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          </ul>
        </aside>

        <main className="flex-1 ml-[20%] p-4 overflow-auto bg-gray-900">
          {selectedPlaylist ? (
            <>
              <button
                onClick={handleBackToPlaylists}
                className="text-white bg-gray-800 hover:bg-gray-700 rounded-full px-4 py-2 mb-4"
              >
                Back to Playlists
              </button>
              <h1 className="text-2xl font-bold mb-4 text-gray-100">{selectedPlaylist.playlistName}</h1>

              <hr className="border-gray-700 mb-4" />

              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePlayAll}
                  className="bg-green-500 text-white rounded-full px-4 py-2 flex items-center hover:bg-green-600"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4v16l15-8z"></path>
                  </svg>
                  Play All
                </button>
                <span className="text-white"><strong>Total Songs: </strong>{selectedPlaylist.songs.length}</span>
                <span className="text-white"><strong>Total Duration: </strong>{formatDuration(totalDuration)}</span>
              </div>

              <hr className="border-gray-700 mb-4" />

              <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2 text-white">Songs</h2>
                <ul className="space-y-2">
                  {selectedPlaylist.songs.map((song) => (
                    <li
                      key={song.songId}
                      className={`bg-gray-700 p-4 rounded-lg flex items-center ${playingSong?.songId === song.songId ? 'bg-green-600' : ''}`}
                    >
                      <img
                        src={`data:image/jpeg;base64,${song.songImage}`}
                        alt={song.songName}
                        className="w-12 h-12 object-cover rounded-full mr-4"
                      />
                      <div className="text-white">
                        <div className="font-semibold">{song.songName}</div>
                        <div className="text-gray-400">{song.songSinger}</div>
                      </div>
                      <button
                        onClick={() => handlePlaySong(song)}
                        className="ml-auto text-green-500 hover:text-green-400"
                      >
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4v16l15-8z"></path>
                          </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-gray-300">Select a playlist to view its songs.</p>
          )}

          {playingSong && (
            <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between border-t border-gray-700">
              <div className="flex items-center">
                <img
                  src={`data:image/jpeg;base64,${playingSong.songImage}`}
                  alt={playingSong.songName}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{playingSong.songName}</h3>
                  <p className="text-gray-400">Singer: {playingSong.songSinger}</p>
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
        </main>
      </div>
    </div>
  );
};

export default MyPlaylists;
