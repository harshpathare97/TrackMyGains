'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMyContext } from '../context/MyContext';


export default function ResetPasswordPage() {
    const router = useRouter();
    const { alert, setAlert } = useMyContext();
    const [credentials, setCredentials] = useState({ password: '', cpassword: '' });
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get('token');
        setToken(resetToken);
    }, []);

    const onChange = (e) => {
        const { name, value } = e.target
        setCredentials({ ...credentials, [name]: value })
      };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (credentials.password !== credentials.cpassword) {
            setAlert({message: "Passwords do not match" , type: "warning"});
            return;
        }

        setLoading(true);

        const response = await fetch('/api/users/forgot-reset-pass', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, password: credentials.password }),
        });

        const data = await response.json();

        if (data.success) {
            setAlert({message: data.message , type: "success"});
            setTimeout(() => router.push('/login'), 2000);
        } else {
            setAlert({message: data.error , type: "danger"});
        }
        setLoading(false);
    };

    return (
        <main className="flex-1 p-1 pb-12 bg-gray-100 flex justify-center">
            <div className="flex flex-col justify-center items-center">
                <div className="container mx-auto my-auto">
                    <div className="flex justify-center">
                        <div className="w-full sm:w-96 lg:w-80">
                            <div className="bg-white text-black shadow-sm border-0 rounded-3xl p-6">
                                <div className="text-center mb-4">
                                    <h2 className="text-3xl font-semibold text-gray-800">Reset Password</h2>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="password">New Password</label>
                                        <input
                                            type="password"
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            id="password"
                                            name="password"
                                            value={credentials.password}
                                            onChange={onChange}
                                            minLength={5}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <input
                                            type="password"
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            id="cpassword"
                                            name="cpassword"
                                            value={credentials.cpassword}
                                            onChange={onChange}
                                            minLength={5}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" disabled={loading}>
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
