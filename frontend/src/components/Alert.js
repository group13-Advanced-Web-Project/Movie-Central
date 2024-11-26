import React, { useState, useEffect } from 'react';
import '../styles/Alert.css'; 

const Alert = ({ message, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {        
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    return (
        <div className="custom-alert">
            <p>{message}</p>
            <button onClick={() => {
                setIsVisible(false);
                if (onClose) onClose();
            }}>Dismiss</button>
        </div>
    );
};

export default Alert;
