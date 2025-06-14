export const ValidationMessages = {
  email: 'Email must be a valid email address',
  emailMaxLengthError: 'Email must be less than 120 characters',
  passwordMinLengthError: 'Password must be at least 6 characters long',
  passwordMaxLengthError: 'Password must be less than 16 characters',
  passwordPatternError:
    'Password must contain at least 1 uppercase letter, 1 number and 1 special character',
  fullNameMinLengthError: 'Full name must be at least 3 characters long',
  fullNameMaxLengthError: 'Full name must be less than 70 characters',
  fullNamePatternError: 'Full name must contain only letters and spaces',
  numberError: 'Only alphabets are accepted',
};

export const Patterns = {
  emailPattern:
    /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,})$/,
  passwordPattern:
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&_()#])([a-zA-Z0-9@$!%*?&_()#])+$/,
  phoneNumberPattern: /^\+([0-9]{1,3})([0-9]{6,12})$/,
  alphabetsPattern: /^[A-Za-z]+$/,
};

export const Lengths = {
  emailMaxLength: 120,
  passwordMaxLength: 16,
  passwordMinLength: 6,
  fullNameMaxLength: 70,
  fullNameMinLength: 3,
};
