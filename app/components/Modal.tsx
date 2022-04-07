import { FC } from 'react';

type Props = {
  open: boolean; 
  title: string;
  description: string;
  onClose: () => void;
};

const Modal: FC<Props> = ({ open, title, description, onClose }) => {
  return (
    <div>
      <input type="checkbox" className="modal-toggle" checked={open} readOnly />
      <div className="modal">
        <div className="modal-box relative">
          <label className="btn btn-sm btn-circle absolute right-2 top-2" onClick={onClose}>✕</label>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="py-4">{description}</p>
        </div>
      </div>
    </div>
  )
};

export default Modal;
