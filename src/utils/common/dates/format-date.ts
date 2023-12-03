const formatDate = (dateString: string) => {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  } as Intl.DateTimeFormatOptions;
  return new Date(dateString).toLocaleDateString('lt-LT', options);
};

export default formatDate;
