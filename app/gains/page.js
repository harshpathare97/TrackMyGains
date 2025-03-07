"use client";
import { useState, useEffect } from "react";
import { useMyContext } from '../context/MyContext';
import WorkoutChart from "../components/WorkoutChart";

export default function Gains() {
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const { data } = useMyContext();

  useEffect(() => {
    if (data.workoutLogs) {
      const logs = data.workoutLogs.map(item => ({
        exerciseName: item.exerciseName,
        logs: item.logs.map(log => ({
          date: log.date.split('T')[0],
          sets: log.sets
        }))
      }));

      setWorkoutLogs(logs);

      if (logs.length > 0) {
        setSelectedExercise(logs[0].exerciseName);
      }
    }
  }, []);

  const exerciseNames = workoutLogs.map(log => log.exerciseName);

  if (workoutLogs.length === 0) {
    return (
      <main className="flex-1 p-1 pb-12 bg-gray-100 flex justify-center">
        <div className="flex flex-col justify-center items-center">
          <p className="text-red-500 text-xl font-semibold text-center">Please click gains button</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-1 pb-12 bg-gray-100">
      <div className="flex flex-col justify-center items-center">
        <div className="container py-1 px-2 lg:px-8">
          <div className="w-full mx-auto lg:w-11/12 lg:bg-white lg:shadow-lg rounded-lg lg:p-8">
            <h1 className="text-4xl font-semibold text-center text-gray-900 mb-6">
              {data.workoutName}
            </h1>
            {/* Dropdown to select exercise */}
            <div className="mb-8 text-center">
              <label htmlFor="exercise-select" className="block text-gray-600 text-lg">
                Select Exercise:
              </label>
              <select
                id="exercise-select"
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="mt-2 border border-gray-300 rounded-md p-3 text-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {exerciseNames.map((exercise) => (
                  <option key={exercise} value={exercise}>
                    {exercise}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-96 flex justify-center">
              {/* Pass the workout logs and selected exercise to the chart */}
              <WorkoutChart workoutLogs={workoutLogs} exerciseName={selectedExercise} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
