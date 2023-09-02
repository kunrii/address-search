const Address = ({ AddressData }) => {

    const comma = ","
    const commaSpace = ", "

    return (
        <div className="address-layout">
            <div className="address-element">{AddressData.ZipCode}, {AddressData.Street}{AddressData.Parish !== "" && comma} {AddressData.Parish}</div>
            <div className="address-element">{AddressData.City}{AddressData.District !== "" && commaSpace}{AddressData.District}, {AddressData.Country}</div>
        </div>
    );
}

export default Address;