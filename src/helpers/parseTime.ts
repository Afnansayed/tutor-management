const parseTime = (timeData: any) => {
  const date = new Date(timeData);
  if (isNaN(date.getTime())) {
    return new Date(`1970-01-01T${timeData}`).getTime();
  }
  return date.getTime();
};

export default parseTime;
