import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from "./InputField"
import { checkValid } from "./ValidInput"

function CreatePage({ isLoggedIn }) {

    const navigate = useNavigate()

    const [zipCode, setZipCode] = useState("");
    const [street, setStreet] = useState("");
    const [parish, setParish] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [country, setCountry] = useState("");

    const create = () => {

        if (!checkValid(zipCode, street, parish, city, district, country))
            return false

        var header = new Headers();
        header.append("Authorization", localStorage.getItem("headerString"));

        var requestOptions = {
            method: 'POST',
            headers: header,
            credentials: "include",
            body: JSON.stringify({ zipCode: zipCode, street: street, parish: parish, city: city, district: district, country: country })
        };

        fetch("http://localhost:5000/api/additem", requestOptions).then(response => {
            if (response.status === 200) {
                console.log(response)
                return response.json()
            } else {
                throw new Error("Bad request " + response.status)
            }
        }).then(data => {
            console.log(data)
            navigate("/list")
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        if (!isLoggedIn)
            navigate("/")
    }, []);

    return (
        <div className="center-container-create">
            <div className="centered-box-create">
                <form className="form">
                    <div className="add-page">Create a new address</div>
                    <InputField props={{ placeholder: "Zip code", value: zipCode, setValue: setZipCode }} />
                    <br />
                    <InputField props={{ placeholder: "Street", value: street, setValue: setStreet }} />
                    <br />
                    <InputField props={{ placeholder: "Parish", value: parish, setValue: setParish }} />
                    <br />
                    <InputField props={{ placeholder: "City", value: city, setValue: setCity }} />
                    <br />
                    <InputField props={{ placeholder: "District", value: district, setValue: setDistrict }} />
                    <br />
                    <InputField props={{ placeholder: "Country", value: country, setValue: setCountry }} />
                    <br />
                    <div className="default-button" onClick={create}>Create</div>
                </form>
            </div>
        </div >
    );
}

export default CreatePage;