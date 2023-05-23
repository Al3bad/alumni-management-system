import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authCtx";
import { getAlumniData } from "../../lib/req";
import "./Admin.scss";
import AlumniDetailsModal from "../../components/AlumniDetailsModal/AlumniDetailsModal";
import AddNewAlumniModal from "../../components/AddNewAlumniModal/AddNewAlumniModal";

//===============================================
// ==> Component
//===============================================
export default function Admin() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [allAlumni, setAllAlumni] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddAlumniModal, setShowAddAlumniModal] = useState(false);

  const getAlumni = async () => {
    const allAlumniData = await getAlumniData();
    setAllAlumni(allAlumniData);
  };

  useEffect(() => {
    const user = async () => {
      return await auth.getUser();
    };

    user().catch(() => navigate("/", { replace: true }));
    getAlumni().catch((_: any) => {});
  }, []);

  if (!auth.user) return <p>Loading ...</p>;
  else if (auth.user.info.role === "student")
    navigate("/alumni", { replace: true });

  const logout = () => {
    auth.logout();
    navigate("/", { replace: true });
  };

  const onAlumniRecordClicked = (studentID: number) => {
    setSelectedAlumni(studentID);
    setShowModal(true);
  };

  const onAddAlumniRecordBtnClicked = () => {
    onAddAlumniModalClose();
    setShowAddAlumniModal(true);
  };

  const onModalClose = () => {
    setSelectedAlumni(null);
    setShowModal(false);
  };

  const onAddAlumniModalClose = () => {
    setSelectedAlumni(null);
    setShowAddAlumniModal(false);
    getAlumni();
  };

  const AddAlumniButton = () => {
    return (
      <li
        key={-1}
        className="add-alumni-btn"
        onClick={() => onAddAlumniRecordBtnClicked()}
      >
        Add Alumni Record
      </li>
    );
  };
  const alumniList = allAlumni.map((alumniData: any, idx: number) => {
    return (
      <li key={idx} onClick={() => onAlumniRecordClicked(alumniData.id)}>
        <span>
          {alumniData.id} - {alumniData.fname} {alumniData.lname}
        </span>
        <div
          className={`tooltip status ${
            alumniData.is_registered ? "green" : "red"
          }`}
        >
          <span className="tooltiptext">
            {alumniData.is_registered ? "registered" : "unregistered"}
          </span>
        </div>
      </li>
    );
  });

  return (
    <div className="admin-profile-page">
      <AlumniDetailsModal
        studentID={selectedAlumni}
        showModal={showModal}
        setShowModal={setShowModal}
        onSubmit={() => {}}
        onCancel={() => onModalClose()}
      />
      <AddNewAlumniModal
        showModal={showAddAlumniModal}
        setShowModal={setShowAddAlumniModal}
        onCancel={() => onAddAlumniModalClose()}
      />
      <div className="container">
        <div className="profile">
          <div className="avatar"></div>
          <div className="info">
            <div className="name">
              {auth.user.info.fname} {auth.user.info.lname}
            </div>
            <div className="student-id">a{auth.user.info.id}</div>
          </div>
          <button className="secondary-btn" onClick={logout}>
            LOGOUT
          </button>
        </div>
        <hr />
        <ul className="alumni-list">
          <AddAlumniButton />
          {alumniList}
        </ul>
      </div>
    </div>
  );
}
