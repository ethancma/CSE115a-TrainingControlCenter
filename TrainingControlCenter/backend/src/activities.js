const dbActivities = require('../db/dbActivities');

// Maual entry activities
// Add manual entry activity
exports.addActivity = async (req, res) => {
  let {username, name, type, sport, distance, time} = req.body;

  // Checks that values are not defaults, it they are, replacaed with null
  if (username === 'string') {
    res.status(401).send('Error, need a username');
    return;
  }
  if (name === 'string') {
    res.status(401).send('Error, need an activity name');
    return;
  }
  if (type === 'string') {
    type = null;
  }
  if (sport === 'string') {
    sport = null;
  }
  if (distance === 0) {
    distance = null;
  }
  if (time === 0) {
    time = null;
  }

  // Add activity metadata to JSON in format similar to strava activity jsons
  const activityJson = {

  }

  const returnValue = await dbActivities.createActivity(username, name, sport, activityJson);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error adding activity');
  } else {
    // On success return 200
    res.status(200).send(name);
  }

};



// Strava upload activities
// TODO

// Delete activity from user's goals TODO check for goals with same name, existence, 
exports.deleteActivity = async (req, res) => {
  const username = req.query.username;
  const name = req.query.name;
    
  returnValue = await dbActivities.deleteActivity(username, name);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error deleting activity');
  } else {
    // On success return 200
    res.status(200).send(name);
  }
};

// Activity accessor functions (to expand in functionality and scope as filters are added)

// Get all activities that match query
exports.getActivities = async (req, res) => {
  const username = req.query.username;
  let name = null;
  let sport = null;
  if (req.query.name) {
    name = req.query.name;
  }
  if (req.query.sport) {
    sport = req.query.sport;
  }

  const returnValue = await dbActivities.findActivity(username, name, sport);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error getting activities, user may not exist');
  } else {
    res.status(200).json(returnValue);
  }
};
