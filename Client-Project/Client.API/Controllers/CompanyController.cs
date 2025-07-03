using Client.Application.Features.Company.Commands;
using Client.Application.Features.Company.Dtos;
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
        //[HttpPost]
        //public async Task<IActionResult> CreateCompany([FromBody] CreateCompanyCommand command)
        //{
        //    var result = await _mediator.Send(command);
        //    return CreatedAtAction(nameof(GetCompanyById), new { Id = result.Id }, result);
        //}
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateCompanyDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var command = new CreateCompanyCommand(dto);
                var result = await _mediator.Send(command);
                return Ok(result); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] UpdateCompanyDto dto)
        {
            try
            {
                var result = await _mediator.Send(new UpdateCompanyCommand(dto));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _mediator.Send(new DeleteCompanyCommand(id));

            if (result == "Success")
                return Ok(new { status = result });

            return NotFound(new { status = result });
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
