'use client'; 
import React, { createContext, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/workouts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        }});
      const data = await response.json();
      if (data.result){
        setWorkouts(data.result);
        setData([])
      } else {
        setError("Failed Fetch Workout.");
      }
      
    } catch (err) {
      setError(err.message);
    }
  };
  
  const addWorkout = async (workout) => {
    try {
      const response = await fetch(`/api/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({workoutName: workout.workoutName, exercises:workout.exercises}),
      });
      const res = await response.json();
      if (res.success){
        closeModal();
        setWorkouts(workouts.concat(res.result))
        setAlert({message: res.message, type: "success"})
      } else{
        closeModal();
        setAlert({message: res.error, type: "danger"})
      }
  } catch (err) {
    setError(err.message);
  }
  };

  const editWorkout = async (id, workout, deleteExercises, updateExercises) => {
    try {
      const response = await fetch(`/api/workouts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({id, workoutName: workout.workoutName, deleteExercises, updateExercises}),
      });
      const res = await response.json();
      if (res.success){
        let newWorkout = JSON.parse(JSON.stringify(workouts))
        for (let index = 0; index < newWorkout.length; index++){
          const element = newWorkout[index];
          if (element.id === id) {
            element.workoutName = workout.workoutName
            element.exercises = workout.exercises
            element.workoutLogs = res.log.workoutLogs
            break
          }
        }
        closeModal();
        setWorkouts(newWorkout)
        setAlert({message: res.message, type: "success"})
        setData([])
      } else{
        closeModal();
        setAlert({message: res.error, type: "danger"})
      }
  } catch (err) {
    setError(err.message);
  }
  }
  
  
  const deleteWorkout = async (id) => {
    try {
      const response = await fetch(`/api/workouts`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({id})
      });
      const res = await response.json();
      if (res.success){
        setWorkouts((prevWorkouts) => prevWorkouts.filter((workouts) => workouts.id !== id));
        setAlert({message: res.message, type: "success"})
      } else{
        setAlert({message: res.error, type: "danger"})
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const addLogs = async (logs, workout) => {
    try {
      const response = await fetch(`/api/workouts/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({id:workout.id, workoutName:workout.workoutName, logs}),
      });
      const res = await response.json();
      if (res.success){
        setAlert({message: res.message, type: "success"})
        setData([]);
        router.push('/');
      } else{
        setAlert({message: res.error, type: "danger"})
      }
    } catch (err) {
    setError(err.message);
  }
  }

  const fetchuser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        }});
      const data = await response.json();
      if (data.user){
        setData(data.user)
      } else {
        setError("Failed To Fetch User.");
      }
    } catch (err) {
      setError(err.message);
    }
  }
  
  return (
    <MyContext.Provider value={{ workouts, error, setError, alert, setAlert, data, setData, modalOpen, openModal, closeModal, fetchWorkouts, addWorkout, editWorkout, deleteWorkout, addLogs }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};
