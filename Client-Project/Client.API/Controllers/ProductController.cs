using Client.Application.Features.Product.Commands;
using Client.Application.Features.Product.Dtos;
using Client.Application.Features.Product.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Client.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ProductController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
        {
            try
            {
                var result = await _mediator.Send(new CreateProductCommand(dto));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] UpdateProductDto dto)
        {
            try
            {
                var result = await _mediator.Send(new UpdateProductCommand(dto));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        //[HttpGet]
        //public async Task<IActionResult> GetAllProducts()
        //{
        //    var result = await _mediator.Send(new GetAllProductQuery());
        //    return Ok(result);
        //}
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int? id, [FromQuery] string? description)
        {
            var products = await _mediator.Send(new GetProductsQuery(id, description));
            return Ok(products);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, [FromQuery] int updatedBy)
        {
            var result = await _mediator.Send(new DeleteProductCommand(id, updatedBy));

            if (result.R_Status == "Success")
                return Ok(result);

            return BadRequest(result);
        }
    }
}
