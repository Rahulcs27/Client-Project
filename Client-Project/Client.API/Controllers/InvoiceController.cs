using Client.Application.Features.Invoice.Commands;
using Client.Application.Features.Invoice.Dtos;
using Client.Application.Features.Invoice.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Client.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly IMediator _mediator;

        public InvoiceController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateInvoice([FromBody] CreateInvoiceDto dto)
        {
            var result = await _mediator.Send(new CreateInvoiceCommand(dto));
            return Ok(result);
        }
        [HttpPut("update")]
        public async Task<IActionResult> UpdateInvoice([FromBody] UpdateInvoiceDto dto)
        {
            var result = await _mediator.Send(new UpdateInvoiceCommand(dto));
            return Ok(result);
        }

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteInvoice(int id, [FromQuery] int updatedBy)
        //{
        //    var result = await _mediator.Send(new DeleteInvoiceCommand(id, updatedBy));
        //    return Ok(result);
        //}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id, [FromQuery] int updatedBy)
        {
            var result = await _mediator.Send(new DeleteInvoiceCommand(id, updatedBy));
            return Ok(new { message = result });
        }


        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int? id)
        {
            var result = await _mediator.Send(new GetInvoicesQuery(id));
            return Ok(result);
        }
    }

}
