import { Formik, Form } from "formik";
import Modal from "../../components/Modal/Modal";
import TextInput from "../../components/TextInput/TextInput";
import { useEffect, useState } from "react";
import { getAlumniData } from "../../lib/req";

import "./AlumniDetailsModal.scss";

interface IProps {
  studentID: number | null;
  showModal: boolean;
  setShowModal: (newVal: boolean) => void;
  submitStr?: string;
  cancelStr?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export default function AlumniDetailsModal({
  studentID,
  showModal,
  setShowModal,
  onSubmit,
  onCancel,
}: IProps) {
  const [alumni, setAlumni] = useState();

  useEffect(() => {
    console.log("Yoooooooooooooooooooooooooooo");
    const getAlumni = async () => {
      const alumniData = await getAlumniData(studentID || undefined);
      console.log(alumniData);
      setAlumni(alumniData);
    };

    getAlumni().catch((_: any) => {});
  }, [studentID]);

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Alumni Details"
      submitStr="CLOSE"
      onSubmit={onSubmit}
      onCancel={onCancel}
    >
      {alumni ? (
        <>
          <p>
            Stduent ID {alumni?.id || "-"}{" "}
            <span
              className={`status ${alumni?.is_registered ? "green" : "red"}`}
            >
              ({alumni?.is_registered ? "registered" : "unregistered"})
            </span>
          </p>
          <Formik
            initialValues={{
              studentID: alumni?.id,
              fname: alumni?.fname,
              lname: alumni?.lname,
              email: alumni?.email,
              mobile: alumni?.mobile,
            }}
            onSubmit={() => {}}
          >
            <Form>
              {/* <TextInput */}
              {/*   label="Student ID" */}
              {/*   name="studentID" */}
              {/*   value={alumni?.id || "-"} */}
              {/*   disabled */}
              {/* /> */}
              <div style={{ display: "flex", gap: "2rem" }}>
                <TextInput
                  label="First Name"
                  name="fname"
                  value={alumni.fname || "-"}
                  disabled
                />
                <TextInput
                  label="Last Name"
                  name="lname"
                  value={alumni?.lname || "-"}
                  disabled
                />
              </div>
              <TextInput
                label="Email"
                name="email"
                value={alumni?.email || "-"}
                disabled
              />
              <TextInput
                label="Modile"
                name="mobile"
                value={alumni?.mobile || "-"}
                disabled
              />
            </Form>
          </Formik>
        </>
      ) : (
        <p>Loading .. </p>
      )}
    </Modal>
  );
}
