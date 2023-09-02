import React from 'react';

function DefaultButton({ onClick, text }) {
    return (
        <div className="default-button" onClick={onClick}>
            {text}
        </div>
    );
}

export default DefaultButton;