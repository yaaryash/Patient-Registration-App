/**
 * Utility to handle input changes for form fields
 * Creates a reusable onChange handler that updates state using the field's name attribute
 * @param {function} setter - State setter function (typically from useState)
 * @returns {function} Event handler function for input onChange events
 *
 * @example
 * const [formData, setFormData] = useState({});
 * const handleChange = handleInputChange(setFormData);
 * <input name="email" onChange={handleChange} />
 */
export function handleInputChange(setter) {
  return (e) => {
    const { name, value } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
}

/**
 * Utility to check if a value is empty (null, undefined, or empty string)
 * @param {*} value - Value to check for emptiness
 * @returns {boolean} True if value is null, undefined, or empty string
 *
 * @example
 * isEmpty("") // true
 * isEmpty(null) // true
 * isEmpty("hello") // false
 */
export function isEmpty(value) {
  return value === undefined || value === null || value === "";
}

/**
 * Gets current Indian date and time formatted string
 * @returns {string} Formatted date-time string in Indian timezone (Asia/Kolkata)
 *
 * @example
 * getIndianDateTime() // "25/12/2023, 02:30:45 PM"
 */
export function getIndianDateTime() {
  const now = new Date();
  let dateTimeString = now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  dateTimeString = dateTimeString.replace(/am/gi, "AM").replace(/pm/gi, "PM");

  return dateTimeString;
}

/**
 * Formats patient data by replacing empty values with dashes
 * Ensures consistent display of patient information by converting null/empty values to "-"
 * @param {Array} patients - Array of patient objects
 * @returns {Array} Formatted patient data with empty fields as "-"
 *
 * @example
 * formatPatientData([{name: "John", phoneNumber: "", age: null}])
 * // Returns: [{name: "John", phoneNumber: "-", age: "-"}]
 */
export function formatPatientData(patients) {
  return patients.map((patient) => ({
    ...patient,
    phoneNumber:
      patient.phoneNumber && patient.phoneNumber.trim() !== ""
        ? patient.phoneNumber
        : "-",
    age:
      patient.age && patient.age.toString().trim() !== "" ? patient.age : "-",
  }));
}
