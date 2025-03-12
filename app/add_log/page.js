"use client";
import React, { useState, useEffect } from 'react';
import { useMyContext } from '../context/MyContext';

function AddLog() {
  const [logs, setLogs] = useState([]);
  const [workout, setWorkout] = useState([]);
  const { addLogs, data, setAlert } = useMyContext();

  useEffect(() => {
    if (data.exercises) {
      const exerciseData = data.exercises.map((exerciseName) => ({
        exercise_name: exerciseName,
        sets: [
          { weight: '', reps: '' },
          { weight: '', reps: '' },
          { weight: '', reps: '' },
        ],
      }));
      setLogs(exerciseData);
      setWorkout({ id: data.id, workoutName: data.workoutName });
    }
  }, []);

    const handleChange = (e, exerciseName, index, field) => {
    const value = e.target.value;

    // Allow numbers up to 3 digits with optional 1 decimal place, no leading zeros, no single "0"
    if (/^([1-9]\d{0,2})(\.\d{0,1})?$/.test(value)) {
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
        const updatedSets = [...exercise.sets, { weight: '', reps: '' }];
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

  // Remove an entire exercise from the log
  const handleRemoveExercise = (exerciseName) => {
    const updatedExercises = logs.filter((exercise) => exercise.exercise_name !== exerciseName);
    setLogs(updatedExercises);
  };

  const handleSubmit = async () => {
    const isValid = logs.every((exercise) => {
      return exercise.sets.every((set) => set.reps !== '' && set.weight !== '');
    });

    if (!isValid) {
      setAlert({ message: "Please fill in all the fields for each exercise.", type: "warning" });
      return;
    }
    addLogs(logs, workout);
  };

  if (logs.length === 0) {
    return (
      <main className="flex-1 p-1 pb-12 bg-gray-100 flex justify-center">
        <div className="flex flex-col justify-center items-center">
          <p className="text-red-500 text-xl font-semibold">Please click add log button</p>
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
              {workout.workoutName}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {logs.map((exercise) => (
                <div key={exercise.exercise_name} className="bg-gray-50 text-black p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all hover:shadow-xl">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className='flex justify-between'>
                      <h5 className="text-2xl font-semibold text-gray-800">{exercise.exercise_name}</h5>
                      <button
                          onClick={() => handleRemoveExercise(exercise.exercise_name)}
                          className=" text-red-500 w-10 h-10 px-2 py-1 rounded-md hover:bg-red-500 hover:text-white"
                        >
                          X
                        </button>
                      </div>
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
                                  <label className="text-gray-700">Set {index + 1}:</label>
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    value={set.reps}
                                    onChange={(e) => handleChange(e, exercise.exercise_name, index, 'reps')}
                                    className="w-14 px-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    value={set.weight}
                                    onChange={(e) => handleChange(e, exercise.exercise_name, index, 'weight')}
                                    className="w-14 px-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </td>
                                <td>
                                  {index > 0 && (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleSubtractSet(exercise.exercise_name, index);
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
                          onClick={() => handleAddSet(exercise.exercise_name)}
                          className="bg-blue-500 text-white px-2 py-1 rounded-lg shadow-md hover:bg-blue-400"
                        >
                          Add Set
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-6 py-3 mx-1 rounded-lg shadow-md hover:bg-green-400 transition duration-200 text-xl"
              >
                Add Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AddLog;
