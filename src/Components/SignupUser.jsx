import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS for styling

function SignupUser() {
  const [inputData, setInputData] = useState({
    userName: "",
    userDob: "",
    userGender: "",
    userPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordValid, setPasswordValid] = useState(false); // Track password validity
  const navigate = useNavigate();

  // Handle changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value
    });

    // Validate password dynamically on change
    if (name === "userPassword") {
      if (validatePassword(value)) {
        setPasswordValid(true);
        setPasswordError("");
      } else {
        setPasswordValid(false);
        setPasswordError("Password must be at least 8 characters long and include a mix of letters, numbers, and special characters.");
      }
    }
  };

  // Validate password
  const validatePassword = (password) => {
    // Regular expression to check if password contains at least one letter, one number, and one special character
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if password is valid
    if (!validatePassword(inputData.userPassword)) {
      setPasswordError("Password must be at least 8 characters long and include a mix of letters, numbers, and special characters.");
      return;
    }

    setPasswordError("");
    setPasswordValid(true);

    try {
      const response = await axios.post('http://localhost:8070/user', inputData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success('Sign up successful!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate('/loginuser');
      } else {
        toast.error('Failed to sign up.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error('Error occurred. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Fill your Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300">Username</label>
            <input
              type="text"
              name="userName"
              value={inputData.userName}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-700 rounded bg-gray-900 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300">Date of Birth</label>
            <input
              type="date"
              name="userDob"
              value={inputData.userDob}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-700 rounded bg-gray-900 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300">Gender</label>
            <select
              name="userGender"
              value={inputData.userGender}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-700 rounded bg-gray-900 text-white"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              name="userPassword"
              value={inputData.userPassword}
              onChange={handleChange}
              className={`w-full p-2 mt-1 border rounded ${passwordValid ? 'border-green-500 bg-gray-900 text-white' : 'border-gray-700 bg-gray-900 text-white'}`}
              required
            />
            {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
            {!passwordError && passwordValid && <p className="text-green-500 mt-2">Valid password</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-2xl hover:bg-green-700"
          >
            Sign Up
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignupUser;
