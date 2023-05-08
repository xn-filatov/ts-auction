import { Formik, Form, Field, ErrorMessage } from "formik";
import { useCookies } from "react-cookie";
import axios from "axios";

type Props = {
  setHasToken: (b: boolean) => void;
};

type AuthError = {
  login?: string;
  password?: string;
};

type AuthValues = {
  login: string;
  password: string;
};

function Auth(props: Props) {
  const { setHasToken } = props;
  const [, setCookie] = useCookies(["token"]);

  const renderError = (msg: string) => (
    <div style={{ color: "red", fontSize: "10px" }}>{msg}</div>
  );

  return (
    <Formik
      initialValues={{ login: "", password: "" }}
      validate={(values: AuthValues) => {
        const errors: AuthError = {};
        if (!values.login) {
          errors.login = "Login required";
        }
        if (!values.password) {
          errors.password = "Password required";
        }
        return errors;
      }}
      onSubmit={(values: AuthValues, { setSubmitting }: any) => {
        setSubmitting(false);
        axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/users`, {
            login: values.login,
            password: values.password,
          })
          .then((res: any) => {
            setCookie("token", res.data.token, { path: "/" });
            setHasToken(true);
          })
          .catch((err: any) => {
            console.log(err);
            if (err.response?.status == 403) alert(err.response?.data);
          });
      }}
    >
      {({ isSubmitting }: any) => (
        <Form style={{ width: "10%" }} className="container mt-5">
          <div className="row">
            <label>Login:</label>
            <Field type="login" name="login" />
            <ErrorMessage name="login" component="div" render={renderError} />
          </div>
          <div className="row mt-2">
            <label>Password:</label>
            <Field type="password" name="password" />
            <ErrorMessage
              name="password"
              component="div"
              render={renderError}
            />
          </div>

          <button className="mt-3" type="submit" disabled={isSubmitting}>
            Sign in
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default Auth;
