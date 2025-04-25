import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AadhaarRegistration = () => {
    const [formData, setFormData] = useState({
        aadhaarNumber: '',
        name: '',
        dateOfBirth: '',
        address: '',
        phoneNumber: '',
        gender: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:5000/api/aadhaar-auth/register', formData);
            navigate('/aadhaar-login');
        } catch (err) {
            setError(err.response?.data?.message || 'Error registering user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Aadhaar Registration
                    </h2>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="aadhaarNumber" className="sr-only">Aadhaar Number</label>
                            <input
                                id="aadhaarNumber"
                                name="aadhaarNumber"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Enter 12-digit Aadhaar number"
                                value={formData.aadhaarNumber}
                                onChange={handleChange}
                                maxLength={12}
                                pattern="\d{12}"
                            />
                        </div>
                        <div>
                            <label htmlFor="name" className="sr-only">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="dateOfBirth" className="sr-only">Date of Birth</label>
                            <input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="sr-only">Address</label>
                            <textarea
                                id="address"
                                name="address"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="sr-only">Phone Number</label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="10-digit Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                maxLength={10}
                                pattern="\d{10}"
                            />
                        </div>
                        <div>
                            <label htmlFor="gender" className="sr-only">Gender</label>
                            <select
                                id="gender"
                                name="gender"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/aadhaar-login')}
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            Already registered? Login here
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AadhaarRegistration; 