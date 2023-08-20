export const converTimeStringToMinutes = (timeString: string) => {
  const [hour, minutes] = timeString.split(':').map(Number);
  const timeInMinutes = hour * 60 + minutes;
  return timeInMinutes;
};
