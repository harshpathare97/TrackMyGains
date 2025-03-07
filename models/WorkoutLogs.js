import mongoose from 'mongoose';

const { Schema } = mongoose;

const setSchema = new Schema({
  weight: { type: Number, required: true },
  reps: { type: Number, required: true }
});

const logSchema = new Schema({
  date: { type: Date, default: Date.now},
  sets: { type: [setSchema], required: true },
});

const exerciseSchema = new Schema({
  exerciseName: { type: String, required: true },
  logs: { type: [logSchema], required: true }
});

const workoutSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  workoutName: { type: String, required: true },
  workoutLogs: { type: [exerciseSchema], required: true },
});

// Create the WorkoutLog model, check if it already exists in the models
const WorkoutLog = mongoose.models.WorkoutLog || mongoose.model('WorkoutLog', workoutSchema);

export default WorkoutLog;