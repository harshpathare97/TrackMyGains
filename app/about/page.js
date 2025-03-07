import React from 'react'

function About() {
  return (
    <main className="flex-1 p-1 pb-12 bg-gray-100">
      <div className="flex flex-col justify-center items-center">
        <div className="container py-1 px-2 lg:px-8">
          <div className="w-full mx-auto lg:w-11/12 lg:bg-white lg:shadow-lg rounded-lg px-8 lg:p-8">
            <h1 className="text-4xl font-semibold text-center text-gray-900 mb-6">About TrackMyGains</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              TrackMyGains is a web application designed to help fitness enthusiasts log and track their workout progress over time.
              Whether you're lifting weights or following a personalized fitness plan, TrackMyGains offers a seamless way to record your workouts and visualize your progress.
            </p>

            <div className="w-full max-w-lg mx-auto bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
              <ul className="list-disc list-inside text-left text-lg text-gray-600 space-y-2">
                <li>Log your workouts, sets, reps, and weights</li>
                <li>View detailed progress charts</li>
                <li>Track improvements in strength and endurance</li>
                <li>Analyze workout data over time</li>
                <li>Easy-to-use interface with an intuitive design</li>
              </ul>
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Why TrackMyGains?</h2>
              <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                Stay motivated by seeing the results of your hard work! With TrackMyGains,
                you can easily monitor your performance, set goals, and see your progress reflected in visual charts.
                It's perfect for beginners, advanced athletes, and anyone who wants to stay on top of their fitness journey.
              </p>
            </div>

            <div className="mt-8 text-center">
              <a href="/signup" className="inline-block px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default About
