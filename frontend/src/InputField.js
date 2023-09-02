import React, { useState } from 'react';
import { checkValid } from "./ValidInput"

function InputField({ props }) {

    const formInvalidClass = "invalid-input"

    const [validRender, setValidRender] = useState(true)

    const handleChange = (e) => {
        const value = e.target.value
        const trimmedValue = e.target.value.trim()
        props.setValue(value);
        setValidRender(checkValid(trimmedValue))
    };

    return (
        <input className={`input-div ${!validRender && formInvalidClass}`} placeholder={props.placeholder} type="text" value={props.value} onChange={(e) => handleChange(e)} />
    );
}

export default InputField