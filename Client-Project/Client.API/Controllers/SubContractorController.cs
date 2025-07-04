﻿using Client.Application.Features.SubContractor.Commands;
using Client.Application.Features.SubContractor.Dtos;
using Client.Application.Features.SubContractor.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Client.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubContractorController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SubContractorController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpPost]
        public async Task<IActionResult> CreateSubContractor([FromBody] CreateSubContractorDto dto)
        {
            var result = await _mediator.Send(new CreateSubContractorCommand(dto));
            return Ok(result);
        }
        [HttpPut]
        public async Task<IActionResult> UpdateSubContractor([FromBody] UpdateSubContractorDto dto)
        {
            var result = await _mediator.Send(new UpdateSubContractorCommand(dto));
            return Ok(result);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubContractor(int id)
        {
            var updatedList = await _mediator.Send(new DeleteSubContractorCommand(id));
            return Ok(updatedList);
        }



        [HttpGet]
        public async Task<IActionResult> GetSubContractors([FromQuery] int? id, [FromQuery] string? search)
        {
            var result = await _mediator.Send(new GetSubContractorQuery(id, search));
            return Ok(result);
        }
    }

}
