import React, { useState, useEffect } from 'react';
import { useMyContext } from '../context/MyContext';

function AddExercise() {
  const workoutTypeMap = {
    'Chest': 'chest',
    'Leg': 'legs',
    'Back': 'back',
    'Biceps': 'biceps',
    'Triceps': 'triceps',
    'Shoulder': 'shoulders',
    'Core': 'core',
    'Full Body': 'fullBody',
  };

  const workoutTypes = [
    'Chest',
    'Back',
    'Shoulder',
    'Biceps',
    'Triceps',
    'Leg',
    'Core',
    'Full Body',
  ];

  const { addWorkout, editWorkout, data, setData, setError, modalOpen, openModal, closeModal } = useMyContext();
  const [previousList, setPreviousList] = useState([]);
  const [exercisesList, setExercisesList] = useState([])
  const [exercise, setExercise] = useState({
    eworkoutType: '',
    etype: [],
    ename: [],
  });

  useEffect(() => {
    const fetchExerciseList = async () => {
      try {
        const response = await fetch('/data/exerciseList.json');
        if (!response.ok) {throw new Error('Failed to fetch exerciseList')}
        const res = await response.json();
        setExercisesList(res);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchExerciseList();
    
    if (data.exercises) {
      setPreviousList(data.exercises);
      setExercise({
        eworkoutType: data?.workoutName || '',
        etype: [],
        ename: data?.exercises || [],
      });
    } else {
      setExercise({
        eworkoutType: '',
        etype: [],
        ename: [],
      });
    }
  }, [data]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const newExercises = checked
        ? [...exercise.ename, value]
        : exercise.ename.filter((item) => item !== value);
      setExercise({ ...exercise, [name]: newExercises });
    } else if (type === 'select-multiple') {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
      setExercise({ ...exercise, [name]: selectedOptions });
    }
  };

  const processList = (arr1,arr2) => {
    if (!arr1 || !arr2) {
      return { deleteExercises: [], updateExercises: [] };  // Return empty arrays in case of missing input
    }
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    const commonExercises = [...set1].filter(exercise =>set2.has(exercise));

    const deleteExercises = arr1.filter(exercise => !commonExercises.includes(exercise));
    const updateExercises = arr2.filter(exercise => !commonExercises.includes(exercise));

    return {deleteExercises, updateExercises}
  };

  const handleSave = () => {
    if (!exercise.eworkoutType || exercise.ename.length === 0) {
      alert('Please select a workout type and at least one exercise.');
      return;
    }
    const workoutName = exercise.eworkoutType;
    const exercise_list = exercise.ename
    const id = data.id;
    if (!data.exercises) {
      addWorkout(workoutName, exercise_list);
      setExercise({ eworkoutType: '', etype: [], ename: [] });
    } else {
      const {deleteExercises, updateExercises} = processList(previousList, exercise.ename)
      editWorkout(id, workoutName, exercise_list, deleteExercises, updateExercises)
      setExercise({ eworkoutType: '', etype: [], ename: [] });
    }
  };

  return (
    <>
      <div className='my-4'>
        <button
          className="bg-blue-600 text-white px-6 py-3 mx-1 rounded-xl shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 ease-in-out text-lg"
          type="button"
          onClick={openModal}
        >
          Add Workout
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" onClick={() => { closeModal(); /*localStorage.removeItem('editWorkout')*/ setData([]); }}>
          <div
            className="modal-dialog bg-white rounded-lg shadow-xl p-6 w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header flex justify-between items-center border-b p-2">
              <h5 className="modal-title text-2xl font-semibold text-gray-800">{data.exercises ? 'Edit Workout' : 'Add Workout'}</h5>
              <button type="button" className="text-gray-500 hover:text-gray-700" onClick={() => { closeModal(); /*localStorage.removeItem('editWorkout')*/ setData([]); }}>
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="modal-body p-2 space-y-4">
              <form className="my-3">
                {/* Workout Type */}
                <div className="mb-4">
                  <label htmlFor="workoutType" className="text-gray-700 text-sm font-medium">
                    Enter Workout
                  </label>
                  <input
                    type="text"
                    placeholder="eg. Chest Workout, Push Workout, Chest & Triceps"
                    id="workoutType"
                    name="etype"
                    value={exercise.eworkoutType}
                    onChange={(e) => { setExercise({ ...exercise, eworkoutType: e.target.value }); }}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Workout Type Dropdown */}
                <div className="mb-4 justify-start flex">
                  <div className="flex items-center space-x-3">
                  <label htmlFor="etype" className="text-gray-700 text-sm font-medium">
                    Search Exercise by Type
                  </label>
                  <select
                    className="px-4 py-2 mt-1 h-10 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    id="etype"
                    name="etype"
                    value={exercise.etype}
                    onChange={onChange}
                    required
                    multiple
                  >
                    {workoutTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                </div>

                {/* Exercises */}
                {exercise.etype.length > 0 && (
                  <div className="mb-4">
                    <label className="text-gray-700 text-sm font-medium">Select Exercises</label>
                    <div className="space-y-2 mt-2 overflow-y-auto lg:max-h-40 max-h-52">
                      {exercise.etype.map((type) => (
                        exercisesList[workoutTypeMap[type]].map((exerciseItem, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={`exercise-${exerciseItem}`}
                              name="ename"
                              value={exerciseItem}
                              onChange={onChange}
                              checked={exercise.ename.includes(exerciseItem)}
                              className="h-5 w-5 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor={`exercise-${exerciseItem}`} className="text-gray-700 text-sm">
                              {exerciseItem}
                            </label>
                          </div>
                        ))
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="modal-footer p-2 border-t flex justify-between space-x-4">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                onClick={() => { closeModal(); setData([]); }}
              >
                Close
              </button>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddExercise;
