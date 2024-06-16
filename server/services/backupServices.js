const fs = require('fs');
const backupFilePath = './data/backup.json';

// Function to backup data
exports.backupData = async (data) => {
    try {
        await fs.promises.writeFile(backupFilePath, JSON.stringify(data));
    } catch (err) {
        console.error('Error backing up data:', err);
    }
};

// Function to restore data
exports.restoreData = async () => {
    try {
        const data = await fs.promises.readFile(backupFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error restoring data:', err);
        return null;
    }
};
