"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMyContext } from "../context/MyContext";

function signup() {
  const { setAlert } = useMyContext();
  const [credentials, setCredentials] = React.useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [loading, setLoading] = React.useState(false);
  let route = useRouter();

  const onChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (credentials.password !== credentials.cpassword) {
      setAlert({ message: "Password not match", type: "warning" });
      return;
    }
    const { name, email, password } = credentials;
    const response = await fetch(`/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const res = await response.json();
    if (res.success) {
      localStorage.setItem("token", res.authtoken);
      setAlert({ message: res.message, type: "success" });
      route.push("/");
    } else {
      setLoading(false);
      setAlert({ message: res.error, type: res.type || "danger" });
    }
  };

  return (
    <main className="flex-1 p-1 pb-12 bg-gray-100 flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <div className="container mx-auto my-auto">
          <div className="flex justify-center">
            <div className="w-full sm:w-96 lg:w-80">
              <div className="bg-white shadow-sm border-0 rounded-3xl p-6">
                <div className="text-center mb-4">
                  <h2 className="text-3xl font-semibold text-gray-800">
                    Sign-up
                  </h2>
                </div>
                <form onSubmit={handleSubmit} className="text-black">
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      id="name"
                      name="name"
                      onChange={onChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="exampleInputEmail1"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      name="email"
                      onChange={onChange}
                    />
                    <div id="emailHelp" className="text-xs text-gray-500 mt-1">
                      We'll never share your email with anyone else.
                    </div>
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
                      id="password"
                      name="password"
                      onChange={onChange}
                      minLength={5}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="cpassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      id="cpassword"
                      name="cpassword"
                      onChange={onChange}
                      minLength={5}
                      required
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
                    <p className="text-gray-700">
                      You have account
                      <Link
                        href={"/login"}
                        className="text-blue-700 hover:text-blue-500"
                      >
                        {" "}
                        Login
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default signup;
