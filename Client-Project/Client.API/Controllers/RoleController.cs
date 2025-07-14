using Client.Application.Features.Role.Commands;
using Client.Application.Features.Role.Dtos;
using Client.Application.Features.Role.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Client.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RoleController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleDto dto)
        {
            var result = await _mediator.Send(new CreateRoleCommand(dto));
            return Ok(result);
        }
        [HttpPut]
        public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleDto dto)
        {
            var result = await _mediator.Send(new UpdateRoleCommand(dto));
            return Ok(result);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id,[FromQuery] int updatedBy)
        {
            var roles = await _mediator.Send(new DeleteRoleCommand(id, updatedBy));
            return Ok(roles);
        }


        [HttpGet]
        public async Task<IActionResult> GetRoles([FromQuery] int? id)
        {
            var roles = await _mediator.Send(new GetRolesQuery(id));
            return Ok(roles);
        }
    }

}
