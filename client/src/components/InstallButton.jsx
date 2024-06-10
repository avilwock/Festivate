// InstallButton.jsx
// import React from 'react';

const InstallButton = () => {
  const handleInstallClick = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => {
          console.log('Service Worker registered successfully');
          // Handle any installation prompts here
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  };

  return (
    <button onClick={handleInstallClick}>
      Install App
    </button>
  );
};

export default InstallButton;
