using Client.Application.Features.User.Commands;
using Client.Application.Features.User.Dtos;
using Client.Application.Features.User.Queries;
using Client.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Client.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IUserRepository _userRepository;

        public UserController(IMediator mediator , IUserRepository userRepository)
        {
            _mediator = mediator;
            _userRepository = userRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            var result = await _mediator.Send(new CreateUserCommand(dto));
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto dto)
        {
            var allUsers = await _mediator.Send(new UpdateUserCommand(dto));
            return Ok(allUsers);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id,[FromQuery] int updatedBy, [FromQuery]int companyId)
        {
            var result = await _mediator.Send(new DeleteUserCommand(id,updatedBy,companyId));

            if (result != null)
                return Ok(result);

            return BadRequest(new { message = "Check SP" });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            try
            {
                if (! await _userRepository.VerifyRecaptchaAsync(loginDto.RecaptchaToken))
                    return BadRequest("reCAPTCHA verification failed.");
                var token = await _userRepository.LoginAsync(loginDto.Username, loginDto.Password);
                return Ok(new { token });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid username or password");
            }
        }

        

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] int? companyId,[FromQuery] int? id, [FromQuery] string? search)
        {
            var result = await _mediator.Send(new GetUsersQuery(companyId,id, search ));
            return Ok(result);
        }
    }

}
