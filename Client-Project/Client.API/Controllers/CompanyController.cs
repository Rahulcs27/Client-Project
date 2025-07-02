using Client.Application.Features.Product.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Client.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly IMediator _mediator;
        public CompanyController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllCompanies()
        {
            var result = await _mediator.Send(new GetAllCompanyQuery());
            return Ok(result);
        }
        [HttpGet("{Id}")]
        public async Task<IActionResult> GetCompanyById(int Id)
        {
            var result = await _mediator.Send(new GetByIdCompanyQuery(Id));
            return Ok(result);
        }
    }
}
