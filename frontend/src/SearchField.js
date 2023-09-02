import React from "react";
import { useState } from "react";
import Select from "react-select"
import { checkValid } from "./ValidInput";

function SearchField({ props }) {

    const [inputValue, setInputValue] = useState("")

    const handleInputChange = (input) => {

        setInputValue(input)

        if (checkValid(input)) {
            getSearchList(input)
        } else if (input !== "") {
            props.setOptions([])
        }
    }

    const getSearchList = (input) => {

        if (!checkValid(input))
            return false

        const payload = { searchString: input }
        const jsonData = JSON.stringify(payload)

        var header = new Headers();
        header.append('Content-Type', 'application/json')
        header.append("Authorization", localStorage.getItem("headerString"));

        var requestOptions = {
            method: 'POST',
            headers: header,
            credentials: "include",
            body: jsonData
        };

        fetch('http://localhost:5000/api/searchlist', requestOptions).then(response => {
            if (response.status === 200) {
                console.log(response)
                return response.json()
            } else {
                throw new Error("Bad request " + response.status)
            }
        }).then(data => {
            console.log(data)
            setSelectOptions(data)
        }).catch(error => {
            console.log(error);
        });
    }

    const setSelectOptions = (data) => {
        var newOptions = data.map((element) => {
            const label = `${element.AddressData.ZipCode}, ${element.AddressData.Street}, ${element.AddressData.City}, ${element.AddressData.Country} ${element.AddressData.Parish} ${element.AddressData.District}`
            const value = element.Id
            return { label: label, value: value }
        })

        props.setOptions(newOptions)
    }

    const handleClick = (selectedOption) => {
        console.log('Selected Option:' + selectedOption);
        props.setOptions([selectedOption])
        props.onClickShowMarker(selectedOption)
    };

    const handleSelectFocus = () => {
        setInputValue("")
    }

    return (
        <div>
            <Select
                options={props.options}
                isSearchable={true}
                placeholder={props.placeholder}
                //https://stackoverflow.com/questions/59159428/how-can-i-pull-react-selects-drop-down-menu-aboveits-z-index-expansionpanel
                styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999, width: "400px" }),
                    input: (provided) => ({ ...provided, width: "400px" }),
                    menu: (provided) => ({ ...provided, fontFamily: "Arial, Helvetica, sans-serif" }), // Remove the semicolon
                }}
                menuPortalTarget={document.querySelector('body')}
                //
                onChange={handleClick}
                onInputChange={handleInputChange}
                noOptionsMessage={() => "No options available"}
                onFocus={handleSelectFocus}
                inputValue={inputValue}
            />
        </div>
    );
}

export default SearchField