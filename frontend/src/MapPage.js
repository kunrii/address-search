import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import SearchField from "./SearchField";
import Address from "./Address";

function MapPage({ isLoggedIn }) {

    // Coordinates for the initial marker
    const initialMapPosition = [0, 0]
    const [listData, setListData] = useState([]);
    const navigate = useNavigate()
    const [options, setOptions] = useState([])
    const [map, setMap] = useState(null)
    const markerRefs = useRef([]);

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
            map.setView([data[0].LocationData.Latitude, data[0].LocationData.Longitude]);
        }).catch(error => {
            console.log(error);
        });
    }

    const onClickShowMarker = (markerId) => {

        if (!map) {
            console.log("There is no map")
            return
        }

        const markerIndex = listData.findIndex((item) => item.Id === markerId.value);
        if (markerIndex !== -1) {
            const marker = markerRefs.current[markerIndex];
            if (marker) {
                map.flyTo(marker.getLatLng(), 13);
                marker.openPopup();
            }
        }
    }

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/")
        } else if (map !== null) {
            getList()
        }
    }, [map]);


    return (
        <div>
            <div className="search-bar">
                <SearchField props={{ placeholder: "Search...", setOptions: setOptions, options: options, onClickShowMarker: onClickShowMarker }} />
            </div>
            <div className="map-wrapper">
                <MapContainer center={initialMapPosition} zoom={13} scrollWheelZoom={true} className="leaflet-container" ref={setMap}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {listData.map(item => (
                        <Marker key={item.Id} position={[item.LocationData.Latitude, item.LocationData.Longitude]} ref={(ref) => (markerRefs.current[item.Id] = ref)}>
                            <Popup>
                                <Address AddressData={item.AddressData} />
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

export default MapPage;