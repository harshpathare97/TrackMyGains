"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { saveLogs, uploadLogs } from "@/lib/indexedDb";

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [alert, setAlert] = useState(null);
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker
        .register("/service-worker.js", { type: "module" })
        .then(() => {
          return navigator.serviceWorker.ready;
        })
        .then((registration) => {
          return registration.sync.register("sync-logs");
        });
    }
  }, []);

  const fetchUser = async () => {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    if (data.user) {
      setUser(data.user);
    } else {
      setError(true);
    }
  };

  const fetchWorkouts = async () => {
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
      setError(true);
    }
  };

  const addWorkout = async (workout) => {
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
      setAlert({ message: res.error, type: res.type || "danger" });
    }
  };

  const editWorkout = async (id, workout, deleteExercises, updateExercises) => {
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
  };

  const deleteWorkout = async (id) => {
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
  };

  const addLogs = async (id, logs) => {
    if (navigator.onLine) {
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
    } else {
      uploadLogs(id, logs);
      setAlert({ message: "Logs will be upload when you're online", type: "success" });
      setData([]);
      router.push("/");
    }
  };

  const saveLocally = async (id, logs) => {
    await saveLogs(id, logs);
    setAlert({ message: "Logs saved loaclly", type: "success" });
    setData([]);
    router.push("/");
  };

  return (
    <MyContext.Provider
      value={{
        user,
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
        fetchUser,
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
