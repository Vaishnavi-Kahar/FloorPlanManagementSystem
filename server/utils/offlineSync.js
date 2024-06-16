const mongoose = require('mongoose');
const FloorPlan = require('../models/FloorPlan');
const localforage = require('localforage');

// Function to save updates to local storage when offline
exports.saveOfflineUpdate = async (update) => {
  await localforage.setItem('offlineUpdate', update);
};

// Function to sync updates to the server when back online
exports.syncUpdates = async () => {
  const update = await localforage.getItem('offlineUpdate');
  if (update) {
    try {
      const response = await fetch('/api/floor-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      });

      if (response.ok) {
        await localforage.removeItem('offlineUpdate');
      } else {
        throw new Error('Failed to sync updates');
      }
    } catch (err) {
      console.error('Error syncing updates:', err);
    }
  }
};
