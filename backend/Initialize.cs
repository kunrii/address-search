public static class Initialize
{
    public static async void AddressData(bool val, string API_KEY)
    {
        if (val)
        {
            await Addresses.GetInstance().GenerateAddresses(API_KEY);
        }
    }
}