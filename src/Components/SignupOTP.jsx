import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignupOTP() {
  const [userMobile, setUserMobile] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  // Function to handle OTP generation
  const handleGenerateOtp = async () => {
    try {
      console.log(`Requesting OTP for mobile: ${userMobile}`); // Debugging line
      const response = await fetch('http://localhost:8070/userotp/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ userMobile }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate OTP');
      }

      const otp = await response.text();
      console.log(`OTP response: ${otp}`); // Debugging line
      toast.success('OTP has been generated and sent to your mobile number.');
    } catch (error) {
      toast.error(`Error generating OTP: ${error.message}`);
    }
  };

// Debugging: Log the OTP before sending it to the backend
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log(`Submitting OTP: ${otp} for mobile: ${userMobile}`); // Log OTP

  try {
    const response = await fetch('http://localhost:8070/userotp/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ userMobile, otp }),
    });

    if (!response.ok) {
      throw new Error('OTP validation failed');
    }

    const isValid = await response.json();
    console.log(`Validation result: ${isValid}`); // Debugging line

    if (isValid) {
      toast.success('OTP validated successfully!');
      navigate("/signupuser");
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  } catch (error) {
    toast.error(`Error validating OTP: ${error.message}`);
  }
};


  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-300">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userMobile" className="block text-sm font-medium mb-2">
              Mobile Number
            </label>
            <input
              type="text"
              id="userMobile"
              value={userMobile}
              onChange={(e) => setUserMobile(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your mobile number"
              required
            />
          </div>
          <button
            type="button"
            onClick={handleGenerateOtp}
            className="w-full bg-green-600 p-3 rounded-lg text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          >
            Generate OTP
          </button>
          <div className="mb-6">
            <label htmlFor="otp" className="block text-sm font-medium mb-2">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter the OTP"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 p-3 rounded-lg text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Submit
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignupOTP;
