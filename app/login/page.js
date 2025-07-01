"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useMyContext } from "../context/MyContext";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert";

function login() {
  const { setAlert } = useMyContext();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  let route = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      route.push("/");
    }
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const response = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const res = await response.json();
    if (res.success) {
      localStorage.setItem("token", res.authtoken);
      setAlert({ message: res.message, type: "success" });
      route.push("/");
    } else {
      setLoading(false);
      setAlert({ message: res.error, type: "danger" });
    }
  };

  return (
    <>
      <Navbar />
      <Alert />
      <main className="flex-1 p-1 pb-12 bg-gray-100 flex justify-center">
        <div className="flex flex-col justify-center items-center">
          <div className="container mx-auto my-auto">
            <div className="flex justify-center">
              <div className="w-full sm:w-96 lg:w-80">
                <div className="bg-white shadow-sm border-0 rounded-3xl p-6">
                  <div className="text-center mb-4">
                    <h2 className="text-3xl font-semibold text-gray-800">
                      Login
                    </h2>
                  </div>
                  <form onSubmit={handleSubmit} className="text-black">
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
                        value={credentials.email}
                        onChange={onChange}
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        value={credentials.password}
                        onChange={onChange}
                        name="password"
                        id="password"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      disabled={loading}
                    >
                      {loading ? "Submiting..." : "Submit"}
                    </button>
                    <div className="my-3 text-center">
                      <Link
                        href={"/forgot-password"}
                        className="text-blue-700 hover:text-blue-500"
                      >
                        Forgot password
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default login;
