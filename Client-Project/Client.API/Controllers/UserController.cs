﻿using Client.Application.Features.User.Commands;
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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            dto.Id = id;
            var allUsers = await _mediator.Send(new UpdateUserCommand(dto));
            return Ok(allUsers);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _mediator.Send(new DeleteUserCommand(id));

            if (result == "SUCCESS")
                return Ok(new { message = "User deleted successfully." });

            return BadRequest(new { message = result });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            try
            {
                var token = await _userRepository.LoginAsync(loginDto.Username, loginDto.Password);
                return Ok(new { token });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid username or password");
            }
        }


        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] int? id, [FromQuery] string? search)
        {
            var result = await _mediator.Send(new GetUsersQuery(id, search));
            return Ok(result);
        }
    }

}
