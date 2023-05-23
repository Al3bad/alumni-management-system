import { ReactNode } from "react";
import "./Modal.scss";

//===============================================
// ==> Types
//===============================================
interface IProps {
  children: ReactNode;
  maxWidth?: string | number;
  showModal: boolean;
  setShowModal: (newVal: boolean) => void;
  title?: string;
  submitStr?: string;
  cancelStr?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

//===============================================
// ==> Component Definition
//===============================================
const Modal = ({
  children,
  showModal,
  // setShowModal,
  title,
  submitStr,
  cancelStr,
  onSubmit,
  onCancel,
  maxWidth,
  isSubmitting,
}: IProps) => {
  if (!showModal) return null;
  return (
    <div className="modal">
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal-container" style={{ maxWidth }}>
        {title && <div className="modal__title">{title}</div>}
        <div className="modal__body">
          {children || <div className="modal__body-empty">Empty Modal</div>}
        </div>
        {(onSubmit || onCancel) && (
          <div className="modal__controls">
            {onSubmit && (
              <button
                className="submit-btn primary-btn"
                disabled={isSubmitting}
                onClick={onSubmit}
              >
                {submitStr || "Submit"}
              </button>
            )}
            {onCancel && (
              <button className="secondary-btn" onClick={onCancel}>
                {cancelStr || "Cancel"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
