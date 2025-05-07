export const getCurrentDay = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  return days[today];
};

export const getCurrentDate = (dayName = getCurrentDay()) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const date = new Date();
  const currentDay = getCurrentDay();

  // Calculate the difference in days between the target day and current day
  const daysDiff =
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(dayName) -
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(currentDay);

  // Adjust the date by adding/subtracting the day difference
  date.setDate(date.getDate() + daysDiff);

  // Get the month name and day number
  const month = months[date.getMonth()];
  const day = date.getDate();

  // Return formatted date string ("Jan 15" for example)
  return `${month} ${day}`;
};

export const isToday = (dayName) => {
  return dayName === getCurrentDay();
};

export const getLocalDate = (date = new Date()) => {
  const offset = 2; // GMT+2
  const localDate = new Date(date);
  const utc = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * offset);
};

export const formatDateForAPI = (date = new Date()) => {
  const localDate = getLocalDate(date);
  return localDate.toISOString();
};

export const startOfDay = (date = new Date()) => {
  const localDate = getLocalDate(date);
  localDate.setHours(0, 0, 0, 0);
  return localDate;
};
