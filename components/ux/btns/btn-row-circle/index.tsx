import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { Icon } from "@components/ux";

import "./btnRowCircle.css";

interface BtnRowCircleProps {
    icon?: React.ReactNode;
    id?: string;
    onClick: () => void;
    className?: string;
}

const BtnRowCircle: React.FC<BtnRowCircleProps> = ({ icon, id = "", onClick, className = "" }) => {
    return (
        <div className={`container-row-circle ${className}`} id={id}>
            <button onClick={() => { onClick && onClick() }}>
                <Icon icon={icon ? icon : <FaArrowLeft />} />
            </button>
        </div>
    );
}

export default BtnRowCircle;
