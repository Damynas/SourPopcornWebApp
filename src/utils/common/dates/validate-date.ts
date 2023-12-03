const validateDate = (dateString: string) => {
  // Define a regular expression for the YYYY-MM-DD format
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

  // Test if the date string matches the specified format
  if (!dateFormatRegex.test(dateString)) {
    return false;
  }

  // Parse the date to check for validity
  const parsedDate = new Date(dateString);

  // Check if the parsed date is a valid date
  return !isNaN(parsedDate.getTime());
};

export default validateDate;
