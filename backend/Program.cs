using System.Text.Json;
using Microsoft.AspNetCore.Authentication;

///////////////////////////////////////////////////////////////////////////////////////
//WebApplication builder setup
///////////////////////////////////////////////////////////////////////////////////////

var builder = WebApplication.CreateBuilder(args);

//cors, authentication, authorization
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policyBuilder =>
    {
        policyBuilder.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowCredentials().AllowAnyMethod();
    });
});
builder.Services.AddAuthentication("BasicAuthentication").AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);
var app = builder.Build();

///////////////////////////////////////////////////////////////////////////////////////
//initialize data if debug
///////////////////////////////////////////////////////////////////////////////////////

var customSettings = builder.Configuration.GetSection("CustomSettings");

Initialize.AddressData(bool.Parse(customSettings["INIT_DATA"]), customSettings["API_KEY"]);

///////////////////////////////////////////////////////////////////////////////////////
//middlewares
///////////////////////////////////////////////////////////////////////////////////////

//cors, authentication, authorization
app.UseCors();
app.UseAuthentication();

///////////////////////////////////////////////////////////////////////////////////////
//routes
///////////////////////////////////////////////////////////////////////////////////////

app.MapGet("/api/login", async (HttpContext context) =>
{
    context.Response.StatusCode = StatusCodes.Status200OK;
    await context.Response.WriteAsync(JsonSerializer.Serialize(new { ok = "ok" }));
});

app.MapGet("/api/getlist", async (HttpContext context) =>
{
    context.Response.StatusCode = StatusCodes.Status200OK;
    await context.Response.WriteAsync(JsonSerializer.Serialize(Addresses.GetInstance().AddressCollection));
});

app.MapDelete("/api/deleteitem", async (HttpContext context) =>
{
    using var reader = new StreamReader(context.Request.Body);
    var requestBody = await reader.ReadToEndAsync();
    var json = JsonSerializer.Deserialize<dynamic>(requestBody);
    int id = json.GetProperty("Id").GetInt32();
    bool res = Addresses.GetInstance().DeleteAddress(id);

    context.Response.StatusCode = StatusCodes.Status200OK;
    await context.Response.WriteAsync(JsonSerializer.Serialize(Addresses.GetInstance().AddressCollection));
});

app.MapPost("/api/additem", async (HttpContext context) =>
{
    using var reader = new StreamReader(context.Request.Body);
    var requestBody = await reader.ReadToEndAsync();
    var json = JsonSerializer.Deserialize<dynamic>(requestBody);

    var s = await AddressSimple.CreateAddressSimple(customSettings["API_KEY"], json.GetProperty("zipCode").GetString(), json.GetProperty("street").GetString(), json.GetProperty("parish").GetString(), json.GetProperty("city").GetString(), json.GetProperty("district").GetString(), json.GetProperty("country").GetString());
    if (s != null)
    {
        Addresses.GetInstance().AddAddress(s);
        context.Response.StatusCode = StatusCodes.Status200OK;
        await context.Response.WriteAsync(JsonSerializer.Serialize(new { ok = "OK!" }));
    }
    else
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await context.Response.WriteAsync(JsonSerializer.Serialize(new { ok = "Failed to create address!" }));
    }
});

app.MapPost("/api/searchlist", async (HttpContext context) =>
{
    using var reader = new StreamReader(context.Request.Body);
    var requestBody = await reader.ReadToEndAsync();
    var json = JsonSerializer.Deserialize<dynamic>(requestBody);

    string searchStringVar = json.GetProperty("searchString").ToString();

    var addresses = Addresses.GetInstance().SearchAddresses(searchStringVar);

    context.Response.StatusCode = StatusCodes.Status200OK;
    await context.Response.WriteAsync(JsonSerializer.Serialize(addresses));
});

///////////////////////////////////////////////////////////////////////////////////////
//app run point
///////////////////////////////////////////////////////////////////////////////////////
app.Run();
