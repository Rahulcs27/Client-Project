using Client.Application.Features.PaymentReports.Dtos;
using Client.Application.Features.PaymentReports.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Client.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ReportController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // Paid Balance Report
        [HttpGet("paid-report")]
        public async Task<ActionResult<List<PaidReportDto>>> GetPaidReport([FromQuery] int? month, [FromQuery] int? year, [FromQuery] string? paymentMode)
        {
            var result = await _mediator.Send(new GetPaidReportQuery(month, year, paymentMode));
            return Ok(result);
        }

        // Unpaid Balance Report
        [HttpGet("unpaid-report")]
        public async Task<ActionResult<List<UnpaidReportDto>>> GetUnpaidReport([FromQuery] int? month, [FromQuery] int? year, [FromQuery] string? paymentMode)
        {
            var result = await _mediator.Send(new GetUnpaidReportQuery(month, year, paymentMode));
            return Ok(result);
        }

        // Product Wise Report
        [HttpGet("product-wise-report")]
        public async Task<ActionResult<List<ProductWiseReportDto>>> GetProductWiseReport([FromQuery] int? month, [FromQuery] int? year, [FromQuery] string? productName)
        {
            var result = await _mediator.Send(new GetProductWiseReportQuery(month, year, productName));
            return Ok(result);
        }

        // Subcontractor Wise Report
        [HttpGet("subcontractor-wise-report")]
        public async Task<ActionResult<List<SubcontractorWiseReportDto>>> GetSubcontractorWiseReport([FromQuery] int? month, [FromQuery] int? year, [FromQuery] string? subCoName)
        {
            var result = await _mediator.Send(new GetSubcontractorWiseReportQuery(month, year, subCoName));
            return Ok(result);
        }
    }
}
