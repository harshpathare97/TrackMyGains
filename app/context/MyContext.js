"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { saveLogs, uploadLogs } from "@/lib/indexedDb";

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker
        .register("/service-worker.js", {type: "module"})
        .then(() => {
          return navigator.serviceWorker.ready;
        })
        .then((registration) => {
          return registration.sync.register("sync-logs");
        })
        .catch(console.error);
    }
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/workouts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      if (data.result) {
        setWorkouts(data.result);
        setData([]);
        setLoading(false);
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          workoutName: workout.workoutName,
          exercises: workout.exercises,
        }),
      });
      const res = await response.json();
      if (res.success) {
        closeModal();
        setWorkouts(workouts.concat(res.result));
        setAlert({ message: res.message, type: "success" });
      } else {
        closeModal();
        setAlert({ message: res.error, type: "danger" });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const editWorkout = async (id, workout, deleteExercises, updateExercises) => {
    try {
      const response = await fetch(`/api/workouts`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          id,
          workoutName: workout.workoutName,
          deleteExercises,
          updateExercises,
        }),
      });
      const res = await response.json();
      if (res.success) {
        let newWorkout = JSON.parse(JSON.stringify(workouts));
        for (let index = 0; index < newWorkout.length; index++) {
          const element = newWorkout[index];
          if (element.id === id) {
            element.workoutName = workout.workoutName;
            element.exercises = workout.exercises;
            element.workoutLogs = res.log.workoutLogs;
            break;
          }
        }
        closeModal();
        setWorkouts(newWorkout);
        setAlert({ message: res.message, type: "success" });
        setData([]);
      } else {
        closeModal();
        setAlert({ message: res.error, type: "danger" });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteWorkout = async (id) => {
    try {
      const response = await fetch(`/api/workouts`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ id }),
      });
      const res = await response.json();
      if (res.success) {
        setWorkouts((prevWorkouts) =>
          prevWorkouts.filter((workouts) => workouts.id !== id)
        );
        setAlert({ message: res.message, type: "success" });
      } else {
        setAlert({ message: res.error, type: "danger" });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const addLogs = async (id, logs) => {
    if (navigator.onLine) {
      try {
        const response = await fetch(`/api/workouts/logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ id, logs }),
        });

        const res = await response.json();

        if (res.success) {
          setAlert({ message: res.message, type: "success" });
          setData([]);
          router.push("/");
        } else {
          setAlert({ message: res.error, type: "danger" });
        }
      } catch (err) {
        setError(err.message);
      }
    } else {
      uploadLogs(id, logs);
      setAlert({ message: "Logs well upload on internet", type: "success" });
      setData([]);
      router.push("/");
    }
  };

  const saveLocally = async (id, logs) => {
    await saveLogs(id, logs);
    setAlert({ message: "Logs saved", type: "success" });
    setData([]);
    router.push("/");
  };
  

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      if (data.user) {
        console.log("Name:", data.user.name);
        console.log("Email:", data.user.email);
      } else {
        setError("Failed To Fetch User.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <MyContext.Provider
      value={{
        workouts,
        error,
        setError,
        alert,
        setAlert,
        data,
        setData,
        loading,
        modalOpen,
        openModal,
        closeModal,
        fetchWorkouts,
        addWorkout,
        editWorkout,
        deleteWorkout,
        addLogs,
        saveLocally,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};
