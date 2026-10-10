export default function Modal({ isOpen, title, children, footer, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-backdrop" onClick={onClose}>
      <div className="custom-modal card" onClick={(event) => event.stopPropagation()}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{title}</h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
        </div>
        <div className="card-body">{children}</div>
        {footer ? <div className="card-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
