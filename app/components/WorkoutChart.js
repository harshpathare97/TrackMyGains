"use client";
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const WorkoutChart = ({ workoutLogs, exerciseName }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Store the chart instance

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // If there is an existing chart, destroy it to avoid memory leaks
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Prepare labels (dates) for x-axis
      const labels = workoutLogs[0].logs.map(log => log.date);

      // Filter and map over the workoutLogs to find the selected exercise
      const dataForExercise = workoutLogs
        .filter(exercise => exercise.exerciseName === exerciseName) // Find the logs for the selected exercise
        .flatMap(exercise => {
          // Now map over the logs for this exercise
          return exercise.logs.map(log => {
            // For each log, we need both the weight and reps for each set, and calculate the total weight lifted (weight * reps)
            return log.sets.map(set => ({
              weight: set.weight, // Store the weight for this set
              reps: set.reps, // Store the reps for this set
              totalWeightLifted: set.weight * set.reps, // Calculate the total weight lifted (weight * reps) for this set
              date: log.date, // Keep track of the date of the log
            }));
          }).flat(); // Flatten to get all sets into a single array
        });

      // If there is no data for the selected exercise, return early
      if (dataForExercise.length === 0 || labels.length === 0) {
        return;
      }

      // Create an object to store the total weight lifted per day
      const dailyTotals = labels.reduce((acc, date) => {
        acc[date] = 0; // Initialize each date with 0
        return acc;
      }, {});

      // Sum up the total weight lifted per day
      dataForExercise.forEach(entry => {
        if (dailyTotals[entry.date] !== undefined) {
          dailyTotals[entry.date] += entry.totalWeightLifted; // Add the total weight lifted for each day
        }
      });

      // Convert dailyTotals object to an array that matches the order of labels
      const data = labels.map(label => dailyTotals[label] || 0); // If no data for a specific day, set it to 0

      // Chart data: Use the sum of the total weight lifted for each day
      const chartData = {
        labels: labels, // Dates for x-axis
        datasets: [
          {
            label: exerciseName, // Exercise name (e.g., "Barbell Bench Press")
            data: data, // Total weight lifted for each day
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            pointRadius: 5,  // Customize point size for clarity
            pointHoverRadius: 8,  // Hover effect size
            showLine: false,  // No line connecting points
            tension: 0.4,
            pointStyle: 'circle',
          },
        ],
      };

      // Create a new chart instance and store it in the ref
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Weight X Reps',
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                // Customizing the tooltip to show all the weight and reps for each set
                label: (context) => {
                  const index = context.dataIndex;  // Get the index of the point
                  const logsForDay = workoutLogs
                    .filter(exercise => exercise.exerciseName === exerciseName)
                    .flatMap(exercise => exercise.logs)[index]; // Get the logs for that specific day

                  const setDetails = logsForDay.sets.map(set => {
                    return `Weight: ${set.weight}kg, Reps: ${set.reps}`; // Show weight and reps for each set
                  });

                  return setDetails; // Join the details of each set for that day
                }
              }
            }
          }
        },
      });
    }

    // Cleanup the chart instance when the component is unmounted or the data changes
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [workoutLogs, exerciseName]);

  return <canvas ref={chartRef} className="w-full h-auto mx-0" />;
};

export default WorkoutChart;
