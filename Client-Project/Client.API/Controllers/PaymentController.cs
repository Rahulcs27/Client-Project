using Client.Application.Features.Payment.Commands;
using Client.Application.Features.Payment.Dtos;
using Client.Application.Features.Payment.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Client.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PaymentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetPayments([FromQuery]int companyId,int? id)
        {
            var result = await _mediator.Send(new GetPaymentDetailsQuery(companyId,id));
            return Ok(result);
        }

       
        [HttpPost]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentDto paymentDto)
        {
            var result = await _mediator.Send(new CreatePaymentCommand(paymentDto));
            if (result == null)
                return BadRequest("Insert failed or unable to retrieve payment.");

            return Ok(result);
        }
        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] UpdatePaymentDto dto)
        {
            var result = await _mediator.Send(new UpdatePaymentCommand(dto));
            return Ok(result);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(int id, int updatedBy,int companyId)
        {
            var result = await _mediator.Send(new DeletePaymentCommand(id, updatedBy,companyId));
            return Ok(result);
        }


    }

}
