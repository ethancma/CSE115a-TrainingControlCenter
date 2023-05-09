
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
  Collapse,
  MenuItem, 
  Select,
  Typography
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const username = localStorage.getItem('user');

export default function AddWorkoutForm() {
  const [{ name, type, sport }, setState] = useState({
    name: '',
    type: null,
    sport: null
    
  });

  // successMessage
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // additionalInfo
  const [additionalInfo, setAdditionalInfo] = useState({
    distance: '',
    time: null,
    
    start_date_local: null,
    description: ''
  });

  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const descriptions = additionalInfo.description.trim() === '' ? null : additionalInfo.description;
      const formattedDate = additionalInfo.start_date_local ? new Date(additionalInfo.start_date_local) : null;
      const response = await fetch('http://localhost:3010/v0/activities?' , {
        method: "POST",
        body: JSON.stringify({
          username: username,
          name: name,
          type: type, 
          sport: sport,
          description: descriptions,
          json: {
            distance: additionalInfo.distance,
            time: additionalInfo.time,
            start_date_local: formattedDate
          }
        }),        
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (response.status === 200) {
        setShowSuccessMessage(true);
        setState({ name: '', type: '', sport: '' });
        setAdditionalInfo({ distance: '', time: '', 
                            date: '', start_date_local: '', description: ''});
        setShowAdditionalInfo(false);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 10000);       
      } else {
        const data = await response.json();
        setErrorMessage(data.message);
        setTimeout(() => {
          setErrorMessage('');
        }, 10000);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred. Please try again.');
  
      setTimeout(() => {
        setErrorMessage('');
      }, 10000);
    }
  };
  
  // get activity types
  const getActivityTypes = () => {
    const activityTypes = [
        "Workout",
        "Race",
        "Endurance",
        "Social",
        "Commute"
      ];
    return activityTypes;
  };

  // get user favorite for sport types
  const [favoriteSports, setFavoriteSports] = useState([]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://localhost:3010/v0/favorites?' 
                        + new URLSearchParams({username: username}));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const favoriteSports = await response.json();
      setFavoriteSports(favoriteSports);
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred. Please try again.');

      setTimeout(() => {
        setErrorMessage('');
      }, 10000);
    }
  };
  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <>
      <h2>Log a Workout</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <Typography variant="h6" ml={2}>Name of Activity*</Typography>
        <Box mb={2} ml={2}>
          <TextField
            id="name"
            value={name}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, name: e.target.value }))
            }
            required
          />
        </Box>
        {/* Activity Type */}
        <Typography variant="h6" ml={2}>Activity Type</Typography>
        <Box mb={2} ml={2}>
          <Select
            labelId="activity-type"
            id="type"
            value={type}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, type: e.target.value }))
            }
            halfWidth
          >
            {getActivityTypes().map((activityType) => (
              <MenuItem key={activityType} value={activityType}>
                {activityType}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {/* Sport */}
          <Box mb={2} ml={2}>
            <Typography variant="h6">Sport Type</Typography>
            <Select
              labelId="sport-type"
              id="sport"
              value={sport}
              onChange={(e) =>
                setState((prevState) => ({ ...prevState, sport: e.target.value }))
              }
              halfWidth
            >
              {favoriteSports.map((sportType) => (
                <MenuItem key={sportType} value={sportType}>
                  {sportType}
                </MenuItem>
              ))}
            </Select>
          </Box>
        {/* Distance */}
        <Box mb={2} ml={2}>
          <Typography variant="h6">Distance (miles)</Typography>
          <TextField
            id="distance"
            value={additionalInfo.distance}
            onChange={(e) =>
              setAdditionalInfo((prevState) => ({
                ...prevState,
                distance: e.target.value,
              }))
            }
            type="number"
          />
        </Box>
        {/* Time */}
        <Box mb={2} ml={2}>
          <Typography variant="h6">Time (minutes)</Typography>
          <TextField
            id="time"
            value={additionalInfo.time}
            onChange={(e) => {
              setAdditionalInfo((prevState) => ({
                ...prevState,
                time: e.target.value
              }));
            }}
            type="number"
          />
        </Box>
        {/* Additional Information */}
        <Box mb={2} ml={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
        >
          {showAdditionalInfo ? 'Hide' : 'Add'} Additional Information
        </Button>
      </Box>
      <Collapse in={showAdditionalInfo}>   
        <Box mb={2} ml={2}>
        {/* Date */}
        <Typography variant="h6">Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
        <DatePicker
          inputFormat="YYYY-MM-DD"
          onChange={(value) =>
              setAdditionalInfo((prevState) => ({
                ...prevState,
                start_date_local: value.toISOString(),
              }))
            }
        />        
        </DemoContainer>
        </LocalizationProvider>
        </Box>
        <Box mb={2}>
        {/* Description */}
          <Typography variant="h6" ml={2} align="top">Description</Typography>
          <TextField
            id="outlined-multiline-static"
            value={additionalInfo.description}
            onChange={(e) =>
              setAdditionalInfo((prevState) => ({
                ...prevState,
                description: e.target.value,
              }))
            }
            multiline
            fullWidth
            rows={4}
            sx={{ ml: 2 }}
          />
        </Box>
      </Collapse>
        <Button variant="contained" color="primary" type="submit" ml={2}>
          Add Workout
        </Button>
        <Snackbar
          open={showSuccessMessage}
          autoHideDuration={10000}
          onClose={() => setShowSuccessMessage(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="success" onClose={() => setShowSuccessMessage(false)}>
            Workout added successfully!
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={10000}
          onClose={() => setErrorMessage('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="error" onClose={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </form>
    </>
  );
}
