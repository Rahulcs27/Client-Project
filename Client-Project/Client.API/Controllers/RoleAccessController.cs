using Client.API.Authorization.Attributes;
using Client.Application.Features.RoleAccessControl.Dtos;
using Client.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Client.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[ScreenAccess("ROLE_ACCESS", "View")]
    public class RoleAccessController : ControllerBase
    {
        private readonly IRoleAccessRepository _accessService;

        public RoleAccessController(IRoleAccessRepository accessService)
        {
            _accessService = accessService;
        }

        [HttpPost]
        public async Task<IActionResult> InsertRoleAccess([FromBody] RoleAccessDto dto)
        {
            var result = await _accessService.InsertRoleAccessAsync(dto);
            return Ok(new { status = result });
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRoleAccess([FromBody] UpdateRoleAccessDto dto)
        {
            var result = await _accessService.UpdateRoleAccessAsync(dto);
            return Ok(new { status = result });
        }

        
        [HttpGet]
        public async Task<IActionResult> GetUserAccess([FromQuery] int? userId, [FromQuery] string username)
        {
            var accessList = await _accessService.GetUserAccessAsync(userId, username);
            return Ok(accessList);
        }
    }
}
