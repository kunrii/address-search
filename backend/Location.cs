using System.Text.Json;

public class Location
{
    public double Latitude { get; private set; }
    public double Longitude { get; private set; }

    const string latcode = "lat";
    const string loncode = "lng";

    private Location(dynamic location)
    {

        Latitude = location.GetProperty(latcode).GetDouble();
        Longitude = location.GetProperty(loncode).GetDouble();
    }

    public static async Task<Location> CreateLocation(string url, string API_KEY)
    {
        try
        {
            var httpClient = new HttpClient();

            var georequest = String.Format("https://maps.googleapis.com/maps/api/geocode/json?address={0}&key={1}", url, API_KEY);
            var georesponse = await httpClient.GetAsync(georequest);

            if (georesponse.IsSuccessStatusCode)
            {
                var responseBody = await georesponse.Content.ReadAsStringAsync();

                //compile time checks are disabled for dynamic objects
                dynamic jsonObject = JsonSerializer.Deserialize<dynamic>(responseBody);
                dynamic locationResults = jsonObject.GetProperty("results")[0].GetProperty("geometry").GetProperty("location");

                return new Location(locationResults);
            }
            else
            {
                return null;
            }
        }
        catch (Exception e)
        {
            return null;
        }
    }
}