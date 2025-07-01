import React from 'react'
import { useRouter } from 'next/navigation';
import { useMyContext } from "../context/MyContext";

function Profile() {
  const [modal, setModal] = React.useState(false);
  const {user, loading} = useMyContext()
  const route = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    route.push("/login");
  };

  if (loading) return

  return (
    <div>
      <button className="bg-blue-600 text-white md:px-4 md:py-2 px-2 py-0 mx-1 rounded-lg shadow-lg hover:bg-blue-500 transition duration-200" onClick={() => setModal(true)}>
        Profile
      </button>
      {modal && (
        <div className="fixed inset-0 bg-gray-900/50 z-40" onClick={() => {setModal(false);}}>
          <div className="fixed top-20 md:right-5 text-black bg-white rounded-lg p-4 z-50 w-full md:w-80">
            <h2 className="text-2xl text-center font-semibold">Profile</h2>
            <div className="border border-gray-200 p-2 my-3 rounded-md">
              <p>
                <span>Name:</span> {user.name}
              </p>
              <p>
                <span>Email:</span> {user.email}
              </p>
            </div>
            <button className='text-white bg-blue-500 w-full p-2 rounded' onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
