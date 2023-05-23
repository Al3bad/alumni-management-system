import { Form, Formik } from "formik";
import Modal from "../Modal/Modal";
import TextInput from "../TextInput/TextInput";
import { addNewAlumniFormValidationSchema } from "../../../common/validation";

import "./AddNewAlumniModal.scss";
import { useRef, useState } from "react";
import { addNewAlumniRecord } from "../../lib/req";

interface IProps {
  showModal: boolean;
  setShowModal: (newVal: boolean) => void;
  submitStr?: string;
  cancelStr?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export default function AddNewAlumniModal({
  showModal,
  setShowModal,
  onCancel,
}: IProps) {
  const formRef = useRef<any>();
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFormSubmit = () => {
    if ((formRef.current as any)?.handleSubmit) {
      // call onSubmit handler in the Formik component
      (formRef.current as any).handleSubmit();
    }
  };
  return (
    <div className="add-new-alumni-modal">
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        title="Add New Alumni Record"
        onSubmit={onFormSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
      >
        {errorMsg ? <p className="error-message">{errorMsg}</p> : null}
        <Formik
          innerRef={formRef}
          initialValues={{
            studentID: "",
            fname: "",
            lname: "",
          }}
          validationSchema={addNewAlumniFormValidationSchema}
          onSubmit={async (values) => {
            setIsSubmitting(true);
            if (errorMsg) setErrorMsg("");
            try {
              await addNewAlumniRecord(values);
              if (onCancel) onCancel();
            } catch (error: any) {
              setErrorMsg(error);
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <Form>
            <TextInput
              label="Student ID"
              name="studentID"
              // onChange={formik.handleChange}
              // value={formik.values.studentID}
            />
            <div style={{ display: "flex", gap: "2rem" }}>
              <TextInput
                label="First Name"
                name="fname"
                // onChange={formik.handleChange}
                // value={formik.values.fname}
              />
              <TextInput
                label="Last Name"
                name="lname"
                // onChange={formik.handleChange}
                // value={formik.values.lname}
              />
            </div>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
}
