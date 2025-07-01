"use client";

import { useState } from "react";
import { useMyContext } from "../context/MyContext";

export default function ForgotPassword() {
  const { setAlert } = useMyContext();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const response = await fetch("/api/users/forgot-reset-pass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (data.success) {
      setAlert({ message: data.message, type: "success" });
    } else {
      setAlert({ message: data.error, type: "danger" });
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
                  <h2 className="text-3xl font-semibold text-gray-800">
                    Forgot Password
                  </h2>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
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
