// Utility to handle input changes for form fields
export function handleInputChange(setter) {
  return (e) => {
    const { name, value } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
}

// Utility to check if a value is empty (null, undefined, or empty string)
export function isEmpty(value) {
  return value === undefined || value === null || value === '';
} 