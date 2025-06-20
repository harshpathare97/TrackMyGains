"use client";
import React, { useState, useEffect } from "react";
import { useMyContext } from "../context/MyContext";
import { getSave, deleteSave } from "@/lib/indexedDb";

function AddLog() {
  const [logs, setLogs] = useState([]);
  const [workout, setWorkout] = useState([]);
  const { addLogs, saveLocally, data, setAlert } = useMyContext();
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const initializeWorkout = async () => {
      if (!data.exercises) return;
      const exerciseData = data.exercises.map((exerciseName) => ({
        exercise_name: exerciseName,
        sets: [{ weight: "", reps: "" }],
      }));

      setLogs(exerciseData);
      setWorkout({ id: data.id, workoutName: data.workoutName });

      const logData = await getSave(data.id);

      if (logData) {
        const merged = exerciseData.map((defaultExercise) => {
          const logged = logData.logs.find(
            (e) => e.exercise_name === defaultExercise.exercise_name
          );
          if (logged && Array.isArray(logged.sets)) {
            return {
              ...defaultExercise,
              sets: logged.sets,
            };
          }

          return defaultExercise; // No matching log, keep default
        });

        setLogs(merged);
        await deleteSave(data.id);
      }
    };

    initializeWorkout();
  }, []);

  const handleChange = (e, exerciseName, index, field) => {
    const value = e.target.value;

    // Allow empty value for erasing and numbers up to 3 digits with optional 1 decimal place, no leading zeros, no single "0"
    if (value === "" || /^([1-9]\d{0,2})(\.\d{0,1})?$/.test(value)) {
      const updatedExercises = logs.map((exercise) => {
        if (exercise.exercise_name === exerciseName) {
          const updatedSets = [...exercise.sets];
          updatedSets[index][field] = value;
          return { ...exercise, sets: updatedSets };
        }
        return exercise;
      });
      setLogs(updatedExercises);
    }
  };

  // Add a new set to the exercise
  const handleAddSet = (exerciseName) => {
    const updatedExercises = logs.map((exercise) => {
      if (exercise.exercise_name === exerciseName) {
        const updatedSets = [...exercise.sets, { weight: "", reps: "" }];
        return { ...exercise, sets: updatedSets };
      }
      return exercise;
    });
    setLogs(updatedExercises);
  };

  // Subtract a set from the exercise
  const handleSubtractSet = (exerciseName, index) => {
    const updatedExercises = logs.map((exercise) => {
      if (exercise.exercise_name === exerciseName) {
        const updatedSets = [...exercise.sets];
        updatedSets.splice(index, 1); // Remove the set at the specified index
        return { ...exercise, sets: updatedSets };
      }
      return exercise;
    });
    setLogs(updatedExercises);
  };

  const filterCompleteLogs = () => {
    const filteredLogs = logs
      .map((exercise) => {
        const completeSets = exercise.sets.filter(
          (set) => set.reps !== "" && set.weight !== ""
        );
        if (completeSets.length > 0) {
          return { ...exercise, sets: completeSets };
        }
        return null;
      })
      .filter(Boolean);

    if (filteredLogs.length === 0) {
      setAlert({
        message: "Please fill in at least one set to add a log.",
        type: "warning",
      });
      return null;
    }

    return filteredLogs;
  };

  const handleSubmit = () => {
    const filteredLogs = filterCompleteLogs();
    if (!filteredLogs) return;
    addLogs(workout.id, filteredLogs);
  };

  const handleSave = () => {
    const filteredLogs = filterCompleteLogs();
    if (!filteredLogs) return;
    saveLocally(workout.id, filteredLogs);
  };

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main
      className={`flex-1 p-1 pb-12 bg-gray-100 ${
        logs.length === 0 && "flex justify-center"
      }`}
    >
      <div className="flex flex-col justify-center items-center">
        {logs.length === 0 ? (
          <p className="text-red-500 text-xl font-semibold">
            Please click add log button
          </p>
        ) : (
          <div className="container py-1 px-2 lg:px-8">
            <div className="w-full mx-auto lg:w-11/12 lg:bg-white lg:shadow-lg rounded-lg lg:p-8">
              <h1 className="text-4xl font-semibold text-center text-gray-900 mb-6">
                {workout.workoutName}
              </h1>
              <div>
                <ul className="space-y-2">
                  {logs.map((exercise, index) => (
                    <li key={index} className="border rounded shadow-sm">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="w-full text-left px-4 py-2 bg-gray-50 text-black hover:bg-gray-100 font-medium"
                      >
                        {exercise.exercise_name}
                      </button>
                      {openIndex === index && (
                        <div className="px-4 py-2 bg-white border-t text-gray-700">
                          <div>
                            <form onSubmit={handleSubmit}>
                              <table className="table-auto w-full text-center text-lg mt-2">
                                <thead>
                                  <tr>
                                    <td>Sr No.</td>
                                    <td>Reps</td>
                                    <td>Weight</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {exercise.sets.map((set, index) => (
                                    <tr key={index}>
                                      <td>
                                        <label>Set {index + 1}:</label>
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          value={set.reps}
                                          onChange={(e) =>
                                            handleChange(
                                              e,
                                              exercise.exercise_name,
                                              index,
                                              "reps"
                                            )
                                          }
                                          className="w-14 px-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          value={set.weight}
                                          onChange={(e) =>
                                            handleChange(
                                              e,
                                              exercise.exercise_name,
                                              index,
                                              "weight"
                                            )
                                          }
                                          className="w-14 px-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                      </td>
                                      <td>
                                        {index > 0 && (
                                          <button
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleSubtractSet(
                                                exercise.exercise_name,
                                                index
                                              );
                                            }}
                                            className="bg-red-500 text-white px-3 rounded-md hover:bg-red-400"
                                          >
                                            -
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </form>
                            <div className="flex justify-end mt-2">
                              <button
                                onClick={() =>
                                  handleAddSet(exercise.exercise_name)
                                }
                                className="bg-blue-500 text-white px-2 py-1 rounded-lg shadow-md hover:bg-blue-400"
                              >
                                Add Set
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center mt-6">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-6 py-3 mx-1 rounded-lg shadow-md hover:bg-blue-400 transition duration-200 text-xl"
                >
                  Save
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white px-6 py-3 mx-1 rounded-lg shadow-md hover:bg-green-400 transition duration-200 text-xl"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default AddLog;
