using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Swagger;

[ApiController]
[Route("swagger/[controller]")]
public class SwaggerController : ControllerBase
{
    private readonly ISwaggerProvider _swaggerProvider;

    public SwaggerController(ISwaggerProvider swaggerProvider)
    {
        _swaggerProvider = swaggerProvider;
    }

    [HttpGet]
    [Route("{documentName}")]
    public IActionResult GetSwaggerJson(string documentName)
    {
        var swagger = _swaggerProvider.GetSwagger(documentName);
        if (swagger == null)
        {
            return NotFound();
        }

        return Ok(swagger);
    }
}
