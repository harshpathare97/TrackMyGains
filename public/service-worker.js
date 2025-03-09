self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Cache assets when the service worker installs
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If there is a cached response, return it
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, fetch from the network and cache the result
      return fetch(event.request).catch(() => {
        // If the user is offline, show an offline page/message
        if (event.request.mode === 'navigate') {
          return new Response(
            `
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <style>
                /* Base Styles */
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f0f0f0;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh; /* Full viewport height */
                }

                .container {
                  text-align: center;
                  background-color: #fff;
                  padding: 30px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  width: 90%;
                  max-width: 500px; /* Ensures it doesn't grow too large */
                }

                h1 {
                  color: #ff5722;
                  font-size: 2rem;
                  margin-bottom: 10px;
                }

                p {
                  color: #555;
                  font-size: 1rem;
                  margin-top: 10px;
                }

                .icon {
                  font-size: 60px;
                  color: #ff5722;
                }

                /* Media Queries for Responsiveness */
                @media (max-width: 600px) {
                  h1 {
                    font-size: 1.5rem; /* Smaller heading on smaller screens */
                  }

                  .icon {
                    font-size: 50px; /* Smaller icon on smaller screens */
                  }

                  p {
                    font-size: 0.9rem; /* Adjust text size for better readability */
                  }

                  .container {
                    padding: 20px; /* Adjust padding on smaller screens */
                  }
                }

                /* For Larger screens */
                @media (min-width: 1200px) {
                  h1 {
                    font-size: 2.5rem; /* Larger heading on large screens */
                  }

                  p {
                    font-size: 1.1rem;
                  }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="icon">&#x1F6A8;</div> <!-- Warning icon -->
                <h1>You are offline!</h1>
                <p>Please check your internet connection.</p>
              </div>
            </body>
          </html>
            `,
            {
              headers: { 'Content-Type': 'text/html' }
            }
          );            
        }
      });
    })
  );
});
