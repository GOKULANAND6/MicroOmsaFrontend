import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const AddSong = () => {
  const { albumId } = useParams(); // Get albumId from route parameters
  const [formData, setFormData] = useState({
    songName: '',
    songSinger: '',
    songImage: null,
    songMp3: null,
  });

  const navigate = useNavigate();

  const handleFileChange = (e) => {
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
    data.append('songName', formData.songName);
    data.append('songSinger', formData.songSinger);
    data.append('albumId', albumId);
    if (formData.songImage) {
      data.append('songImage', formData.songImage);
    }
    if (formData.songMp3) {
      data.append('songMp3', formData.songMp3);
    }
  
    try {
      const response = await axios.post('http://localhost:8070/song/add', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data); // Debug response
      toast.success(`Song added successfully! ${response.data.message || ''}`);
      // Consider updating the state to reflect success, if needed
      setFormData({
        songName: '',
        songSinger: '',
        songImage: null,
        songMp3: null,
      });
      navigate('/viewalbums'); // Adjust the path as needed
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error adding song.';
      toast.error(errorMessage);
    }
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

          <div className="relative">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 text-white hover:bg-gray-600"
            >
              G
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
          <div className="relative w-full max-w-screen-lg mx-auto mt-8">
            <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-center text-green-500">Add New Song</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="songName" className="block text-lg font-medium mb-2">Song Name</label>
                  <input
                    type="text"
                    id="songName"
                    value={formData.songName}
                    onChange={(e) =>
                      setFormData((prevState) => ({ ...prevState, songName: e.target.value }))
                    }
                    required
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="songSinger" className="block text-lg font-medium mb-2">Song Singer</label>
                  <input
                    type="text"
                    id="songSinger"
                    value={formData.songSinger}
                    onChange={(e) =>
                      setFormData((prevState) => ({ ...prevState, songSinger: e.target.value }))
                    }
                    required
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="songImage" className="block text-lg font-medium mb-2">Song Image</label>
                  <input
                    type="file"
                    id="songImage"
                    name="songImage"
                    onChange={handleFileChange}
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                    accept="image/*"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="songMp3" className="block text-lg font-medium mb-2">Song MP3</label>
                  <input
                    type="file"
                    id="songMp3"
                    name="songMp3"
                    onChange={handleFileChange}
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                    accept="audio/mp3"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Add Song
                </button>
              </form>
            </div>
          </div>
        </main>

        <ToastContainer />
      </div>
    </div>
  );
};

export default AddSong;
