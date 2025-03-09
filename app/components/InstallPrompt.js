"use client";

import { useEffect } from 'react';

export default function InstallPrompt() {
    useEffect(() => {
        let deferredPrompt;

        // Check if 'beforeinstallprompt' event is available in the browser
        if (window.matchMedia('(display-mode: standalone)').matches) {
            // If the app is already installed, skip the prompt
            return;
        }

        // Listen for the 'beforeinstallprompt' event
        window.addEventListener('beforeinstallprompt', (event) => {
            // Prevent the default install prompt from showing
            event.preventDefault();
            // Save the event to trigger later
            deferredPrompt = event;

            // Show the install button
            const installButton = document.getElementById('installButton');
            // Make the button visible with a smooth opacity transition
            installButton.style.display = 'block';
            installButton.classList.remove('opacity-0');
            installButton.classList.add('opacity-100');

            // Handle the click event for the custom button
            installButton.addEventListener('click', () => {
                // Show the install prompt
                deferredPrompt.prompt();

                deferredPrompt.userChoice.then((choiceResult) => {
                    deferredPrompt = null; // Reset the deferred prompt
                });
                // Hide the install button after clicking
                installButton.style.display = 'none';
            });
        });

        return () => {
            // Clean up the event listener
            window.removeEventListener('beforeinstallprompt', () => { });
        };
    }, []);

    return (
        <div>
            <button
                id="installButton"
                className="hidden transition-opacity duration-300 opacity-0 bg-orange-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                style={{ display: 'none' }} // Initially hidden
            >
                Install App
            </button>
        </div>
    );
}
