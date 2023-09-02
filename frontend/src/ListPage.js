import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Address from "./Address";

function ListPage({ isLoggedIn }) {

    const [listData, setListData] = useState([]);
    const navigate = useNavigate()

    const getList = () => {

        var header = new Headers();
        header.append("Authorization", localStorage.getItem("headerString"));

        var requestOptions = {
            method: 'GET',
            headers: header,
            credentials: "include"
        };

        fetch('http://localhost:5000/api/getlist', requestOptions).then(response => {
            if (response.status === 200) {
                console.log(response)
                return response.json()
            } else {
                throw new Error("Bad request " + response.status)
            }
        }).then(data => {
            const sortedData = data.sort((a, b) => a.Id - b.Id)
            setListData(sortedData)
        }).catch(error => {
            console.log(error);
        });
    }

    const deleteItem = (itemId) => {
        var header = new Headers();
        header.append("Authorization", localStorage.getItem("headerString"));

        var requestOptions = {
            method: 'DELETE',
            headers: header,
            credentials: "include",
            body: JSON.stringify({ Id: itemId })
        };

        fetch("http://localhost:5000/api/deleteitem", requestOptions).then(response => {
            if (response.status === 200) {
                console.log(response)
                return response.json()
            } else {
                throw new Error("Bad request " + response.status)
            }
        }).then(data => {
            const sortedData = data.sort((a, b) => a.Id - b.Id)
            setListData(sortedData)
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/")
        } else {
            getList()
        }
    }, []);

    return (
        <div>
            <div className="list-container">
                {listData.map(item => (
                    <div className="list-centered-box" key={item.Id}>
                        <Address AddressData={item.AddressData} />
                        <div className="default-button" onClick={() => deleteItem(item.Id)}>Delete</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListPage;