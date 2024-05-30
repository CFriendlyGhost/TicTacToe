using Microsoft.OpenApi.Models;
using TicTacToe.Server.Controllers;
using TicTacToe.Server.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using TicTacToe.Server;
using System.Security.Claims;

/*var front_url = Environment.GetEnvironmentVariable("INSTANCE_URL");*/
var front_url = "http://localhost:5173";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHealthChecks();
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
                $"{front_url}")
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});

builder.Services.AddAuthorization();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer();

builder.Services.ConfigureOptions<JwtBearerConfigureOptions>();

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
        c.SwaggerEndpoint("/tictac/swagger", "SignalR Hub V1");
    });
}

app.UseHttpsRedirection();
app.MapHealthChecks("/health");


app.MapGet("/env", async context =>
{
    await context.Response.WriteAsync($"Frontend URL: {front_url}");
}).RequireAuthorization();

app.MapGet("/claims", (ClaimsPrincipal claims) => claims.Claims.Select(c => new { c.Type, c.Value }).ToArray())
    .RequireAuthorization()
    .WithName("GetClaims")
    .WithOpenApi();

app.MapControllers();

app.MapFallbackToFile("/index.html");
app.UseRouting();

app.UseCors("AllowSpecificOrigin");

app.UseAuthentication();
app.UseAuthorization();

app.MapHub<GameHub>("/tictac").RequireAuthorization();
app.UseEndpoints(endpoints =>
{
    _ = endpoints.MapControllers();
});



app.Run();
