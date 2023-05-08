import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useCookies } from "react-cookie";

type Props = {
  show: boolean;
  onHide: () => void;
  updateItems: () => void;
};

type CreationValues = {
  name: string;
  startPrice: number;
  duration: number;
};

type CreationError = {
  name?: string;
  startPrice?: string;
  duration?: string;
};

function CreateItemModal(props: Props) {
  const { show, onHide, updateItems } = props;
  const [cookies] = useCookies(["token"]);
  const [isCreationSuccess, setIsCreationSuccess] = useState(false);

  const handleOnHide = () => {
    onHide();
    setIsCreationSuccess(false);
  };

  const renderError = (msg: string) => (
    <div style={{ color: "red", fontSize: "10px" }}>{msg}</div>
  );

  return (
    <Modal show={show} onHide={handleOnHide} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>Deposit</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={{ name: "", startPrice: 0, duration: 0 }}
        validate={(values: CreationValues) => {
          const errors: CreationError = {};
          if (!values.name) {
            errors.name = "Item name required";
          }
          if (!values.startPrice) {
            errors.startPrice = "Start price must be greater then 0";
          }
          if (!values.duration) {
            errors.duration = "Time window must be greater then 0";
          }
          return errors;
        }}
        onSubmit={(values: CreationValues, { setSubmitting }: any) => {
          setSubmitting(false);
          axios
            .post(
              `${process.env.REACT_APP_BACKEND_URL}/bidItems/create`,
              {
                name: values.name,
                startPrice: values.startPrice,
                duration: values.duration,
              },
              { headers: { Authorization: `Bearer ${cookies.token}` } }
            )
            .then((res: any) => {
              setIsCreationSuccess(true);
              updateItems();
            })
            .catch(console.log);
        }}
      >
        {({ isSubmitting }: any) => (
          <Form style={{ width: "100%" }} className="container mt-2">
            {(!isCreationSuccess && (
              <Modal.Body>
                <div className="row">
                  <label>Name:</label>
                  <Field type="name" name="name" />
                  <ErrorMessage
                    name="name"
                    component="div"
                    render={renderError}
                  />
                </div>
                <div className="row mt-2">
                  <label>Start Price:</label>
                  <Field type="startPrice" name="startPrice" />
                  <ErrorMessage
                    name="startPrice"
                    component="div"
                    render={renderError}
                  />
                </div>
                <div className="row mt-2">
                  <label>Time Window (in hours):</label>
                  <Field type="duration" name="duration" />
                  <ErrorMessage
                    name="duration"
                    component="div"
                    render={renderError}
                  />
                </div>
              </Modal.Body>
            )) || <p>New Item created!</p>}
            <Modal.Footer>
              <Button variant="secondary" onClick={handleOnHide}>
                Close
              </Button>
              {!isCreationSuccess && (
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Create
                </Button>
              )}
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

/*


*/

export default CreateItemModal;
