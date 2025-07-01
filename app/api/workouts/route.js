import WorkoutLog from "../../../models/WorkoutLogs";
import connectToMongoDB from '../../../lib/mongodb';
import { authenticate } from "../../../lib/middleware/auth"; 

// Handle GET request - fetch data
export const GET = authenticate(async (req) => {
  try {
    await connectToMongoDB();
    const workouts = await WorkoutLog.find({ user: req.user.id });
    
    // Extract workoutName and exerciseName into an array
    const result = workouts.map(workout => ({
      id: workout._id,
      workoutName: workout.workoutName,
      exercises: workout.workoutLogs.map(log => log.exerciseName),
      workoutLogs: workout.workoutLogs
    }));
    return new Response(JSON.stringify({ result }), { status: 200 })
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Oops! Somethings went wrong on our end. We're working on it." }), { status: 500 });
  }
})

// Handle POST request - add data
export const POST = authenticate(async (req) => {
  let success = true
  const { workoutName, exercises } = await req.json();
  try {
    await connectToMongoDB();

  // Check if the user already has 6 workouts
  const userWorkouts = await WorkoutLog.find({ user: req.user.id });
  if (userWorkouts.length >= 6) {
      return new Response(
        JSON.stringify({ error: "You can only have up to 6 workouts.", type: "warning" }),
        { status: 400 }
      );
    }

    // Convert the array to an array of objects with the exercise name
    const workoutLogs = exercises.map(exercise_name => ({
      exerciseName: exercise_name,
      logs: []
    }));
    // Create a new workout object
    const newWorkout = new WorkoutLog({
      workoutName: workoutName, workoutLogs: workoutLogs, user: req.user.id
    });

    await newWorkout.save();

    // Extract workoutName and exerciseName into an array
    const result = {
      id: newWorkout._id,
      workoutName: workoutName,
      exercises: exercises,
      workoutLogs: newWorkout.workoutLogs
    };

    success = true
    return new Response(
      JSON.stringify({ message: 'Workout added successfully', success, result }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong. Please try again later." }), { status: 500 });
  }
})

  // Handle PUT request - update existing data
export const PUT = authenticate(async (req) => {
  let success = true;
  const { id, workoutName, deleteExercises, updateExercises } = await req.json();

  try {
    await connectToMongoDB();

    // Find the workout log by workoutName (adjust field name if necessary)
    const workoutLog = await WorkoutLog.findById( id );

    if (!workoutLog) {
      return new Response(
        JSON.stringify({ error: 'Workout log not found' }),
        { status: 404 }
      );
    }

    if (workoutLog.workoutName !== workoutName){
      await workoutLog.set({workoutName : workoutName});
    }
    
    // Delete exercises from the workoutLogs array
    if (deleteExercises && deleteExercises.length > 0) {
      await WorkoutLog.updateMany(
        { 'workoutLogs.exerciseName': { $in: deleteExercises } },
        { $pull: { workoutLogs: { exerciseName: { $in: deleteExercises } } } }
      );
    }

    // Add new exercises to existing workout log
    const workoutLogs = updateExercises.map(exercise => ({
      exerciseName: exercise,
      logs: []
    }));

    workoutLog.workoutLogs.push(...workoutLogs); 
    // Save the updated workout log
    await workoutLog.save();

    // Reload the document from the database to get the most up-to-date version
    const log = await WorkoutLog.findById(id);

    success = true;
    return new Response(
      JSON.stringify({ message: 'Workout log updated successfully', success, log }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again later."}),
      { status: 500 }
    );
  }
});

// Handle DELETE request - delete a specific workout by id
export const DELETE = authenticate(async (req) => {
  let success = true
  const { id } = await req.json();

  // Check if id is a valid number
  const workoutId = parseInt(id);
  if (isNaN(workoutId)) {
    return new Response(JSON.stringify({ error: 'Invalid workout id' }), { status: 400 });
  }

  try {
    await connectToMongoDB();
    await WorkoutLog.findByIdAndDelete(id);
    success = true
    return new Response(JSON.stringify({ message: 'Workout deleted successfully', success }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong. Please try again later." }), { status: 500 });
  }
})
