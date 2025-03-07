"use client";
import Alert from "./components/Alert";
import Navbar from "./components/Navbar";
import AddWorkout from "./components/AddWorkout"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useMyContext } from './context/MyContext';

export default function Home() {
  const { fetchWorkouts, deleteWorkout, setData, workout, error, setAlert, openModal } = useMyContext();
  const route = useRouter();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchWorkouts();
    } else {
      route.push("/login")
    }
  }, []);

  const handleDelete = async (id) => {
    deleteWorkout(id)
  };

  const handleEdit = (id, workoutName, exercises) => {
    setData({ id, workoutName, exercises })
    openModal();
  };

  const handleAddLog = (id, workoutName, exercises) => () => {
    setData({ id, workoutName, exercises })
    route.push('/add_log')
  };

  const handleGains = (workoutName, workoutLogs) => () => {
    const logs = workoutLogs[0].logs
    if (logs.length !== 0) {
      setData({ workoutLogs, workoutName })
      route.push('/gains');
    } else {
      setAlert({ message: "No log data found please add log to see gains", type: "warning" })
    }
  };

  if (error) {
    return (
      <>
        <Navbar />
        <Alert />
        <main className="flex-1 p-1 pb-12 bg-gray-100 flex justify-center">
          <div className="flex flex-col justify-center items-center">
            <p className="text-red-500 text-xl font-semibold">{error}</p>
            <p className="text-red-500 text-xl font-semibold">Something went wrong! Please try again later.</p>
            <button className='bg-blue-500 text-white mt-2 px-6 py-2 rounded-lg shadow-md hover:bg-blue-400 transition duration-200' onClick={() => {
              window.location.reload()
            }}>
              Retry
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Alert />
      <main className="flex-1 p-1 pb-12 bg-gray-100">
        <div className="flex flex-col justify-center items-center">
          <div className="container py-1 px-2 lg:px-8">
            <div className="w-full mx-auto lg:w-11/12 lg:bg-white lg:shadow-lg rounded-lg lg:p-8">
              <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">Workouts</h1>
              {workout.length === 0 ? <p className="text-center text-xl text-gray-600">No workouts available.</p>
                :
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {workout.map((workout, index) => (
                    <div key={index} className="bg-gray-50 shadow-lg rounded-xl p-6 transition-all transform hover:scale-105 hover:shadow-xl">
                      <div className="flex flex-col justify-between h-full">
                        <div className="flex justify-between">
                          <h5 className="text-2xl font-semibold text-gray-800">{workout.workoutName}</h5>
                          <div>
                            <button onClick={() => handleEdit(workout.id, workout.workoutName, workout.exercises)} className="text-blue-500 hover:text-blue-400">
                              <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4 mx-2" />
                            </button>
                            <button onClick={() => handleDelete(workout.id)} className="text-red-500 hover:text-red-400">
                              <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4 mx-2" />
                            </button>
                          </div>
                        </div>
                        <div><p className="text-gray-600 text-lg">{workout.exercises.join(', ')}</p></div>

                        <div className="mt-6 flex justify-between items-center">
                          <button onClick={handleGains(workout.workoutName, workout.workoutLogs)} className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-400 transition duration-200">Gains</button>
                          <button onClick={handleAddLog(workout.id, workout.workoutName, workout.exercises)} className="bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-500 transition duration-200">Add Log</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>}
              <div className="mt-6 flex justify-center">
                <AddWorkout />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

