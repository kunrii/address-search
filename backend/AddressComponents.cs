public class AddressComponents
{
    public string ZipCode { get; private set; }
    public string Street { get; private set; }
    public string Parish { get; private set; }
    public string City { get; private set; }
    public string District { get; private set; }
    public string Country { get; private set; }

    public string Url { get; private set; }

    public AddressComponents(string zipCode, string street, string parish, string city, string district, string country)
    {
        ZipCode = zipCode;
        Street = street;
        Parish = parish;
        City = city;
        District = district;
        Country = country;
        Url = GetUrl();
    }

    private string GetUrl()
    {
        //Ignores parish and district to simplify setup
        //In addition, spaces are not valid url characters but the geo api accepts + as an alternative
        return String.Format("{0}, {1}, {2}, {3}", Street, City, ZipCode, Country).Replace(" ", "+");

    }
}