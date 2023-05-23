import * as Yup from "yup";

//===============================================
// ==> Field Validations
//===============================================
export const studentIDValidator = Yup.string()
  .trim()
  .matches(/^s([\d]{7})$/, "Student ID must be in this format: s1234567")
  .required("Required");

export const strongPasswordValidator = Yup.string()
  .min(10)
  .matches(
    /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{10,}$/,
    "Password must contain lower-, uppercase, numbers, & special symbols"
  )
  .required("Required");

export const confirmPasswordValidator = Yup.string()
  .when("password", ([password], schema) => {
    return password
      ? schema.oneOf([Yup.ref("password")], "Passwords must match")
      : schema;
  })
  .required("Required");

export const passwordValidator = Yup.string().min(10).required("Required");

export const emailValidator = Yup.string()
  .email("Invalid email addresss")
  .required("Required");

export const ausMobileValidator = Yup.string()
  .matches(/^(04)[0-9]{8}$/, "Invalid mobile number")
  .required("Required");

//===============================================
// ==> Validation Schemas
//===============================================
export const registerFormValidationSchema = Yup.object({
  studentID: studentIDValidator,
  // fname: Yup.string().required("Required"),
  // lname: Yup.string().required("Required"),
  email: emailValidator,
  mobile: ausMobileValidator,
  password: strongPasswordValidator,
  passwordConfirm: confirmPasswordValidator,
});

export const registerFormValidationBackendSchema = Yup.object({
  studentID: studentIDValidator,
  // fname: Yup.string().required("Required"),
  // lname: Yup.string().required("Required"),
  email: emailValidator,
  mobile: ausMobileValidator,
  password: strongPasswordValidator,
});

export const loginFormValidationSchema = Yup.object({
  email: emailValidator,
  password: passwordValidator,
});

export const addNewAlumniFormValidationSchema = Yup.object({
  studentID: studentIDValidator,
  fname: Yup.string().required("Required"),
  lname: Yup.string().required("Required"),
});
