import { Formik, Form } from "formik";
import Modal from "../../components/Modal/Modal";
import TextInput from "../../components/TextInput/TextInput";
import { useEffect, useState } from "react";
import { getAlumniData, getAlumniDocsData } from "../../lib/req";

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
  // onSubmit,
  onCancel,
}: IProps) {
  const [alumni, setAlumni] = useState<any>();

  useEffect(() => {
    setAlumni(null);
    const getData = async () => {
      if (studentID) {
        const alumniData = await getAlumniData(studentID || undefined);
        const alumniDocsData = await getAlumniDocsData(studentID);
        setAlumni(alumniData);
        setAlumni({ ...alumniData, docs: alumniDocsData });
      }
    };
    getData().catch((_: any) => {});
  }, [studentID]);

  const docList = alumni?.docs?.map((docObj: any, idx: number) => {
    return (
      <li key={idx}>
        <span>
          {docObj.docType} [ID: {docObj.docID}]
        </span>
        {docObj.link ? (
          <a href={`${import.meta.env.VITE_API_URL}${docObj.link}`} download>
            download
          </a>
        ) : null}
      </li>
    );
  });

  return (
    <div className="alumni-details-modal">
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        title="Alumni Details"
        cancelStr="BACK"
        onCancel={onCancel}
      >
        {alumni ? (
          <>
            <h2 className="student-id">
              <span className="underline">
                Student ID: s{alumni?.id || "-"}
              </span>{" "}
              <span
                className={`status ${alumni?.is_registered ? "green" : "red"}`}
              >
                ({alumni?.is_registered ? "registered" : "unregistered"})
              </span>
            </h2>
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
                  label="Mobile"
                  name="mobile"
                  value={alumni?.mobile || "-"}
                  disabled
                />
              </Form>
            </Formik>
            <h2 className="doc-list-heading">Document List</h2>
            <ul className="doc-list">{docList}</ul>
          </>
        ) : (
          <p>Loading .. </p>
        )}
      </Modal>
    </div>
  );
}
