import React from 'react'
import "./_btnText.scss"

interface BtnTextProps {
  children: React.ReactNode;
  onClick: () => void;
}

const BtnText: React.FC<BtnTextProps> = ({ children, onClick }) => {
  return (
    <div className="btn-text">
      <button type="button" onClick={onClick}>
        <span>{children}</span>
      </button>
    </div>
  );
};

export default BtnText;
