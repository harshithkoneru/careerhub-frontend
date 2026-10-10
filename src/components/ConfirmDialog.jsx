export default function ConfirmDialog({ isOpen, title, message, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-backdrop" onClick={onCancel}>
      <div className="custom-modal small-modal card" onClick={(event) => event.stopPropagation()}>
        <div className="card-body">
          <h5>{title}</h5>
          <p className="mb-4">{message}</p>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
