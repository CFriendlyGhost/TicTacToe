using Microsoft.OpenApi.Models;
using TicTacToe.Server.Controllers;
using TicTacToe.Server.Hubs;

var front_url = Environment.GetEnvironmentVariable("INSTANCE_URL");

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton<IDictionary<string, UserConnection>>(options => new Dictionary<string, UserConnection>());

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins(
                $"{front_url}:5173")
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});


builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API V1", Version = "v1" });
});



var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();



if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
        // Explicitly specify the Swagger JSON endpoint for the SignalR hub
        c.SwaggerEndpoint("/tictac/swagger", "SignalR Hub V1");
    });
}



app.UseHttpsRedirection();


app.UseAuthorization();

app.MapControllers();
app.UseCors("AllowSpecificOrigin");
app.MapFallbackToFile("/index.html");
app.UseRouting();
app.MapHub<GameHub>("/tictac");
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
