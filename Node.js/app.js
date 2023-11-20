const express = require('express');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.set('json spaces', 2); //format json message with 2 spaces of indentation
const PORT = 8000;

// Function to find the closest dates before and after a given target date
const locateNearestDates = (populationData, targetDate) => {
  let previousEntry = null;
  let nextEntry = null;

  // Sort the data array by dates in ascending order
  populationData.sort((a, b) => a.date - b.date);
  // Iterate over the sorted data to find the nearest previous and next entries
  for (const entry of populationData) {
    if (entry.date < targetDate) {
      previousEntry = entry;
    } else if (entry.date > targetDate) {
      nextEntry = entry;
      break; // Once we find the nextEntry, we can break the loop
    }
  }

  return { previousEntry, nextEntry };
};

//GET endpoint to retrieve population data for a specific input date
app.get('/LU-population-data/:date', (req, res) => {
  const inputDate = req.params.date;
  const targetDate = new Date(inputDate);

  // Check first if the provided date is valid
  if (isNaN(targetDate)) {
    return res.status(400).json({ error: 'The date format is invalid. Please use YYYY-MM-DD.' });
  }
  
  let populationDataCollected = [];
  fs.createReadStream(path.resolve(__dirname, 'data/LU1_DF_B1100_1.0.csv'))
    .pipe(csvParser({
      mapHeaders: ({ header }) => header.trim()
    }))

    // Event handler for each column of CSV data
    .on('data', (column) => {
      if (column['SPECIFICATION: Specification'].trim() === 'C01: Total population') { //Only data from Total population
        const entryDate = new Date(column['TIME_PERIOD: Time period'].trim()); // Parse the date from TIME_PERIOD column
        const populationCount = column['OBS_VALUE'].trim(); // Parse the population count from OBS_VALUE column 

        // Check for valid entries and add them to the populationDataCollected array
        if (populationCount && !isNaN(entryDate)) {
          populationDataCollected.push({ date: entryDate, value: parseInt(populationCount, 10) });
        }
      }
    })

    // Event handler when CSV file has been fully read
    .on('end', () => {
      //Function to return a formated date YYYY-MM-DD (without hours, minutes... )
      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };

      // Search for an exact match of the input date and return it
      const sameInput = populationDataCollected.find(entry => entry.date.getTime() === targetDate.getTime());
      if (sameInput) {
        return res.json({ date: formatDate(sameInput.date), population: sameInput.value });
      } else {
        // If there's no exact match, search for closest dates before and after the input date
        const { previousEntry, nextEntry } = locateNearestDates(populationDataCollected, targetDate);
        if (previousEntry || nextEntry) {
          const response = {};
          if (previousEntry) {
            response.previousEntry = { date: formatDate(previousEntry.date), population: previousEntry.value };
          }
          if (nextEntry) {
            response.nextEntry = { date: formatDate(nextEntry.date), population: nextEntry.value };
          }
          return res.send(response);  
        } else {
          //In case any of the other conditions are met, return a 404 status message
          return res.status(404).json({ error: 'No nearby dates found.' });
        }
      }
    })

    // Event handler for any errors during reading the CSV file
    .on('error', (err) => {
      res.status(500).json({ error: 'Error reading CSV file' });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});