import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const { premiumId } = useParams();
  const [premium, setPremium] = useState(null);
  const [payerName, setPayerName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
    const [userId, setUserId] = useState(null);
  const [premiumOptions, setPremiumOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchPremium = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/premium/${premiumId}`);
        const premiumData = response.data;
        setPremium(premiumData);
        setAmount(premiumData.premiumPrice); // Set default amount to premium price
      } catch (error) {
        console.error('Error fetching premium details:', error);
        setMessage('Failed to load premium details');
      }
    };

    fetchPremium();
  }, [premiumId, userId]);

  useEffect(() => {
    if (userId) {
      // Fetch user details using userId
      const fetchUser = async () => {
        try {
          const response = await axios.get(`http://localhost:8070/user/${userId}`);
          const userData = response.data;
          setPayerName(userData.userName); // Set payer name from user data
        } catch (error) {
          console.error('Error fetching user details:', error);
          setMessage('Failed to load user details');
        }
      };

      fetchUser();
    }
  }, [userId]);

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


  const userPlaylists = playlists.filter(playlist => playlist.user.userId === userId);


  const handlePayment = async () => {
    if (!userId || !premiumId) {
      setMessage('User ID or Premium ID is not available.');
      return;
    }


    const paymentData = {
      payerName: payerName,
      transactionDate: new Date().toISOString(), // Use ISO string format
      upiId: upiId,
      amount: amount,
      premium: {
        premiumId: parseInt(premiumId, 10), // Ensure this matches your Premium class
      },
      user: {
        userId: parseInt(userId, 10), // Ensure this matches your UserSignup class
      }
    };

    try {
      const response = await axios.post('http://localhost:8070/payment/add', paymentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        navigate('/premiumpageuser');
      } else {
        setMessage('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setMessage('Error processing payment. Please try again.');
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen relative">

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

        <main className="flex-1 ml-[20%] p-4 overflow-auto bg-gray-900 flex space-x-4">
        {/* Premium Details Section */}
        <div className="w-1/3 h-1/2 bg-blue-900 text-white p-6 rounded-lg shadow-lg mt-40">
          {premium ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Premium Details</h2>
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{premium.premiumName}</h3>
                <p className="text-gray-400 mb-2">Validity: {premium.premiumvalidity}</p>
                <p className="text-gray-100 text-2xl font-bold mb-4">{premium.premiumPrice}</p>
                <p className="text-gray-300 mb-4">{premium.premiumDescription}</p>
              </div>
            </>
          ) : (
            <p className="text-gray-400">Loading premium details...</p>
          )}
        </div>

        {/* Payment Details Section */}
        <div className="w-2/3 h-2/3 bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-28">
          <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Payer Name</label>
            <input
              type="text"
              value={payerName}
              readOnly
              className="w-full py-2 px-4 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full py-2 px-4 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Amount</label>
            <input
              type="text"
              value={amount}
              readOnly
              className="w-full py-2 px-4 rounded bg-gray-700 text-white"
            />
          </div>
          <button
            onClick={handlePayment}
            className="bg-green-500 text-white rounded-full px-4 py-2 hover:bg-green-600"
          >
            Pay Now
          </button>
          {message && <p className="text-red-500 mt-4">{message}</p>}
        </div>
      </main>
      </div>           
      
    </div>
  );
};

export default Payment;
