import React from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const UserForm = ({ values, errors, touched, isSubmitting }) => (
  <Form>
    <div>
      {touched.name && errors.name && <p>{errors.name}</p>}
      <Field type="name" name="name" placeholder="Full Name" />
    </div>
    <div>
      {touched.email && errors.email && <p>{errors.email}</p>}
      <Field type="email" name="email" placeholder="Email" />
    </div>
    <div>
      {touched.password && errors.password && <p>{errors.password}</p>}
      <Field type="password" name="password" placeholder="Password" />
    </div>

    <label>
      {touched.tos && errors.tos && <p>{errors.tos}</p>}
      <Field type="checkbox" name="tos" checked={values.tos} />
      TOS
    </label>
    <Field component="select" name="plan">
      <option value="free">Free</option>
      <option value="premium">Premium</option>
    </Field>
    <button disabled={isSubmitting} type="submit">
      Submit
    </button>
  </Form>
);

const FormikApp = withFormik({
  mapPropsToValues({ name, email, password, tos, plan }) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      tos: tos || true,
      plan: plan || "free"
    };
  },

  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),
    password: Yup.string()
      .min(9, "password must be 9 char or longer")
      .required("A password is required"),
    tos: Yup.boolean().oneOf([true], "Must Accept Terms and Conditions")
  }),

  handleSubmit(values, { setErrors, resetForm, setSubmitting }) {
    axios
      .post("https://reqres.in/api/users", {
        email: values.email,
        password: values.password
      })
      .then(response => {
        console.log(response);
        window.alert(
          `Created an account for ${response.data.email} with an id number of ${
            response.data.id
          }.`
        );
      })
      .catch(err => {
        console.log("this is an error:", err);
      });
    console.log(values);
    setTimeout(() => {
      if (values.email === "waffle@syrup.com") {
        setErrors({ email: "That email is taken" });
      } else {
        resetForm();
      }
      //I cant get the submit button to no work while loading
      setSubmitting(false);
    }, 2000);
  }
})(UserForm);

export default FormikApp;
