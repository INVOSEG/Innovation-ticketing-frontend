
// export const formatDate = (date) => {

import moment from "moment";

//   return date.toLocaleDateString("en-US", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };


export const formatDate = (date) => {
  // Check if the input is just a time string
  const timeRegex = /^\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2})$/;

  // If the input is a time string, append today's date
  if (timeRegex.test(date)) {
    const today = new Date();
    const currentDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    date = `${currentDate}T${date}`; // Combine with today's date
  }

  // Parse the provided date string
  const parsedDate = new Date(date);

  // Extract year, month, and day components
  const year = parsedDate.getFullYear();
  const month = parsedDate.getMonth() + 1; // Months are zero-based, so we add 1
  const day = parsedDate.getDate();

  // Ensure month and day are two digits
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const formattedDay = day < 10 ? `0${day}` : `${day}`;

  // Construct the formatted date string
  const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

  return formattedDate;
}

export const formatDuration = (duration) => {
  // Check if the input is a string
  if (typeof duration !== 'string') {
    console.error('Invalid duration format:', duration);
    return '0m'; // or throw an error or return a different default value
  }

  // Extract hours and minutes from the duration string
  const hours = duration.match(/(\d+)H/i);
  const minutes = duration.match(/(\d+)M/i);

  // Construct formatted duration string
  let formattedDuration = '';
  if (hours) {
    formattedDuration += `${hours[1]}h `;
  }
  if (minutes) {
    formattedDuration += `${minutes[1]}m`;
  }

  // Return formatted string or "0m" if no hours or minutes found
  return formattedDuration.trim() || '0m';
}


export const emailRegex = /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

export const cnicRegex = /^[0-9]{13}$/;

export const phoneNumberRegex = /^[0-9]{11}$/;

export function extractTime(timestamp) {
  console.log(timestamp)
  if (timestamp?.includes('-') && !timestamp?.includes('T') && !timestamp.includes('+')) {
    const time = timestamp?.split('-')?.[0];

    // Split the time into hours and minutes and join them with a colon
    const [hours, minutes] = time?.split(':');

    // Return the time in 'hh:mm' format
    return `${hours}:${minutes}`;
  }

  if (timestamp?.includes('Z')) {
    // Split the time into hours and minutes and join them with a colon
    const [hours, minutes] = timestamp?.split(':');

    // Return the time in 'hh:mm' format
    return `${hours}:${minutes}`;
  }

  if (!timestamp?.includes('+')) {
    const parts = timestamp?.split('T') || [];

    const date = parts[0];
    const timeWithOffset = parts[1] || '';

    // Remove the UTC offset (the part after the '+')
    const time = timeWithOffset?.split('+')?.[0] || '';

    // Split the time into hours and minutes and join them with a colon
    const [hours = '', minutes = ''] = time?.split(':') || [];

    return `${hours}:${minutes}`;
  } else {
    const time = timestamp?.split('+')?.[0];

    // Split the time into hours and minutes and join them with a colon
    const [hours, minutes] = time?.split(':');

    // Return the time in 'hh:mm' format
    return `${hours}:${minutes}`;
  }
}

export function extractTimeFromTimestamp(timestamp) {
  // Create a new Date object from the timestamp
  const date = new Date(timestamp);

  // Extract hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Determine AM or PM suffix
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Return in 12-hour format with AM/PM (hh:mm AM/PM)
  return `${hours}:${minutes} ${ampm}`;
}

export function extractTimeFromTimestampMultiCity(timestamp) {
  let date;

  if (timestamp?.endsWith("Z")) {
    // If the timestamp is UTC (ends with 'Z'), create a Date object and treat it as UTC
    date = new Date(timestamp); // The 'Z' tells JS to interpret the time as UTC
  } else {
    // If there's a timezone offset, manually split and create a Date object
    // Example: "10:15:00-05:00" or "10:15:00+02:00"
    const [time, timezone] = timestamp?.split(/(?=[+-])/);  // Split time and timezone (e.g., -05:00)
    date = new Date(`1970-01-01T${time}${timezone}`);  // Use a dummy date and combine time with timezone offset
  }

  // Extract hours and minutes in 24-hour format
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Return in 24-hour format (HH:mm)
  return `${hours}:${minutes}`;
}

export function isNextDay(departureTime, arrivalTime) {
  const dep = moment(departureTime);
  const arr = moment(arrivalTime);

  const dayDiff = arr.startOf('day').diff(dep.startOf('day'), 'days');

  if (dayDiff === 1) return 'Next Day';
  if (dayDiff === 2) return 'Third Day';
  if (dayDiff === 3) return 'Fourth Day';
  if (dayDiff === 4) return 'Fifth Day';
  // You can keep extending this as needed
  if (dayDiff > 4) return `${dayDiff + 1}th Day`;

  return ''; // No label if same day
}

export const validatePassword = (password) => {
  const errors = [];

  // Check minimum length
  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // Check for lowercase letter
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  // Check for uppercase letter
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  // Check for number
  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  // Check for special character
  if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
    errors.push("Password must contain at least one special character i.e. @ #");
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};