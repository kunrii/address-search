public class Addresses
{
    private static Addresses _instance = null;
    public List<AddressSimple> AddressCollection { get; private set; }

    private Addresses()
    {
        AddressCollection = new List<AddressSimple>();
    }

    public static Addresses GetInstance()
    {
        if (_instance == null)
            _instance = new Addresses();

        return _instance;
    }

    public bool AddAddress(AddressSimple a)
    {
        foreach (AddressSimple s in GetInstance().AddressCollection)
        {
            if (a.Equals(s))
                return false;
        }
        AddressCollection.Add(a);
        return true;
    }

    public bool DeleteAddress(int id)
    {
        AddressSimple s = null;
        foreach (AddressSimple o in GetInstance().AddressCollection)
        {
            if (o.Id == id)
                s = o;
        }
        if (s != null)
        {
            return GetInstance().AddressCollection.Remove(s);
        }
        else
        {
            return false;
        }
    }

    public void ListAddresses()
    {
        Console.WriteLine("Listing addresses: ");
        foreach (AddressSimple s in GetInstance().AddressCollection)
        {
            Console.WriteLine(s.ToString());
        }
        Console.WriteLine("");
    }

    public List<AddressSimple> SearchAddresses(string search)
    {
        List<AddressSimple> addresses = new List<AddressSimple>();
        foreach (AddressSimple s in GetInstance().AddressCollection)
        {
            if (s.Search(search))
                addresses.Add(s);
        }
        return addresses;
    }

    public async Task<bool> GenerateAddresses(string API_KEY)
    {
        var tasks = new List<Task<AddressSimple>> {
                AddressSimple.CreateAddressSimple(API_KEY, "4000-407", "Praca General Humberto Delgado", "", "Porto", "", "Portugal"),
                AddressSimple.CreateAddressSimple(API_KEY, "4149-071", "Avenida da Boavista 604", "", "Porto", "", "Portugal"),
                AddressSimple.CreateAddressSimple(API_KEY, "4050-161", "Rua das Carmelitas 144", "", "Porto", "", "Portugal"),
                AddressSimple.CreateAddressSimple(API_KEY, "4000-069", "Praca de Almeida Garrett", "", "Porto", "", "Portugal")
            };

        AddressSimple[] results = await Task.WhenAll(tasks);

        AddressSimple s1 = results[0];
        AddressSimple s2 = results[1];
        AddressSimple s3 = results[2];
        AddressSimple s4 = results[3];

        //failed to build one of the addresses, return false and discard all
        if (s1 == null || s2 == null || s3 == null || s4 == null)
            return false;

        //add validated addresses to list if they do not already exist
        GetInstance().AddAddress(s1);
        GetInstance().AddAddress(s2);
        GetInstance().AddAddress(s3);
        GetInstance().AddAddress(s4);
        //success, returns true
        return true;
    }
}