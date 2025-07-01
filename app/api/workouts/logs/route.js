import WorkoutLog from "../../../../models/WorkoutLogs";
import connectToMongoDB from '../../../../lib/mongodb';
import { authenticate } from "../../../../lib/middleware/auth"; // Import authentication middleware


export const POST = authenticate(async (req) => {
  let success = true;

  const { id, logs } = await req.json();
  try {
    await connectToMongoDB();
    const workoutLog = await WorkoutLog.findById( id );

    if (!workoutLog) {
      return new Response(
        JSON.stringify({ error: 'Workout log not found' }),
        { status: 404 }
      );
    }

    // Iterate through logs and add the sets to the correct exercise in the log
    logs.forEach(exercise => {
      // Find the corresponding exercise in the workout log
      const exerciselog = workoutLog.workoutLogs.find(
        log => log.exerciseName === exercise.exercise_name
      );
      if (exerciselog) {
        exerciselog.logs.push({ date: new Date(), sets: exercise.sets });
      }
    });
    // Save the updated workout log
    await workoutLog.save();

    success = true;
    return new Response(
      JSON.stringify({ message: 'Workout log added successfully', success }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again later." }),
      { status: 500 }
    );
  }
});