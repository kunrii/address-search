public class AddressSimple
{
    public AddressComponents AddressData { get; private set; }
    public Location LocationData { get; private set; }

    private static int _id = 0;
    public int Id { get; private set; }
    private static readonly object _idLock = new object();

    public AddressSimple(AddressComponents components, Location location)
    {
        AddressData = components;
        LocationData = location;
        //Since the objects are being created async, the .NET runtime will fail to increment unless this section of code is synch locked
        lock (_idLock)
        {
            Id = _id;
            _id += 1;
        }
    }

    //Simple override of the ToString() method
    public override string ToString()
    {
        return String.Format("{0}: {1}", Id, AddressData.Url);
    }

    //Allows comparing addresses, if this class were used in a dictionary we would also override GetHashCode
    public override bool Equals(object obj)
    {

        //allows for casting and type validation in a more concise manner
        AddressSimple s = obj as AddressSimple;
        if (s != null)
        {
            return (this.AddressData.ZipCode == s.AddressData.ZipCode &&
                    this.AddressData.Street == s.AddressData.Street &&
                    this.AddressData.Parish == s.AddressData.Parish &&
                    this.AddressData.City == s.AddressData.City &&
                    this.AddressData.District == s.AddressData.District &&
                    this.AddressData.Country == s.AddressData.Country);
        }
        else
        {
            return false;
        }
    }

    public bool Search(string s)
    {
        return (this.AddressData.ZipCode.Contains(s, StringComparison.InvariantCultureIgnoreCase) ||
                this.AddressData.Street.Contains(s, StringComparison.InvariantCultureIgnoreCase) ||
                this.AddressData.Parish.Contains(s, StringComparison.InvariantCultureIgnoreCase) ||
                this.AddressData.City.Contains(s, StringComparison.InvariantCultureIgnoreCase) ||
                this.AddressData.District.Contains(s, StringComparison.InvariantCultureIgnoreCase) ||
                this.AddressData.Country.Contains(s, StringComparison.InvariantCultureIgnoreCase));
    }

    public static async Task<AddressSimple> CreateAddressSimple(string API_KEY, string zipCode, string street, string parish, string city, string district, string country)
    {
        try
        {
            AddressComponents c = new AddressComponents(zipCode, street, parish, city, district, country);
            Location l = await Location.CreateLocation(c.Url, API_KEY);
            if (c == null || l == null)
                throw new InvalidDataException();

            return new AddressSimple(c, l);
        }
        catch (Exception e)
        {
            Console.WriteLine("Failed to create simple address");
            return null;
        }
    }
}