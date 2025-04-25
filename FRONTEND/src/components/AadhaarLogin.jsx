import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const AadhaarLogin = () => {
    const [aadhaarNumber, setAadhaarNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Aadhaar input, 2: OTP verification
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [language, setLanguage] = useState('English');
    const [maskedPhone, setMaskedPhone] = useState('');
    const navigate = useNavigate();

    const handleAadhaarSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate Aadhaar number format
        if (!/^\d{12}$/.test(aadhaarNumber)) {
            setError('Please enter a valid 12-digit Aadhaar number');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/verify-aadhaar`, {
                aadhaarNumber
            });

            if (response.data.success) {
                setMaskedPhone(response.data.data.phone || '+91 XXXXXXX123');
                setStep(2);
                setError('');
            } else {
                setError(response.data.message || 'Verification failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate OTP format
        if (!/^\d{6}$/.test(otp)) {
            setError('Please enter a valid 6-digit OTP');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
                aadhaarNumber,
                otp
            });

            if (response.data.success) {
                // Store the token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/dashboard');
            } else {
                setError(response.data.message || 'OTP verification failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="bg-[#2196f3] shadow">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl text-white font-normal">HealthChain</h1>
                    <button className="text-white font-normal">LOGIN</button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center bg-white py-8">
                <div className="max-w-md w-full mx-4 bg-white border border-gray-200 rounded-lg shadow-md p-8">
                    <div>
                        <h2 className="text-3xl font-normal text-gray-900 mb-6">Login with Aadhaar</h2>
                        
                        {/* Language Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-normal text-gray-700 mb-1">
                                Select Language
                            </label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#2196f3] focus:border-[#2196f3] sm:text-sm rounded-md"
                            >
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Telugu">Telugu</option>
                            </select>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex items-center mb-8">
                            <div className={`flex items-center ${step === 1 ? 'text-[#2196f3]' : 'text-gray-500'}`}>
                                <span className={`w-8 h-8 flex items-center justify-center rounded-full ${step === 1 ? 'bg-[#2196f3] text-white' : 'bg-gray-200'}`}>
                                    1
                                </span>
                                <span className="ml-2 text-sm font-normal">Enter Aadhaar</span>
                            </div>
                            <div className="border-t border-gray-300 flex-1 mx-4"></div>
                            <div className={`flex items-center ${step === 2 ? 'text-[#2196f3]' : 'text-gray-500'}`}>
                                <span className={`w-8 h-8 flex items-center justify-center rounded-full ${step === 2 ? 'bg-[#2196f3] text-white' : 'bg-gray-200'}`}>
                                    2
                                </span>
                                <span className="ml-2 text-sm font-normal">Verify OTP</span>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 flex items-start" role="alert">
                                <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="font-normal">{error}</span>
                            </div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleAadhaarSubmit}>
                                <div className="mb-6">
                                    <label htmlFor="aadhaar" className="block text-sm font-normal text-gray-700 mb-1">
                                        Enter your 12-digit Aadhaar number
                                    </label>
                                    <input
                                        id="aadhaar"
                                        type="text"
                                        value={aadhaarNumber}
                                        onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2196f3] focus:border-[#2196f3] text-base"
                                        placeholder="Enter Aadhaar Number"
                                        maxLength={12}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || aadhaarNumber.length !== 12}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#2196f3] hover:bg-[#1976d2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2196f3] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending OTP...' : 'SEND OTP'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleOtpSubmit}>
                                <div className="mb-6">
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600">
                                            OTP has been sent to your registered mobile number{' '}
                                            <span className="font-medium">{maskedPhone}</span>
                                        </p>
                                    </div>
                                    <label htmlFor="otp" className="block text-sm font-normal text-gray-700 mb-1">
                                        Enter 6-digit OTP
                                    </label>
                                    <input
                                        id="otp"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2196f3] focus:border-[#2196f3] text-base"
                                        placeholder="Enter OTP"
                                        maxLength={6}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#2196f3] hover:bg-[#1976d2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2196f3] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Verifying...' : 'VERIFY OTP'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="mt-4 w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2196f3]"
                                >
                                    Back
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AadhaarLogin; 