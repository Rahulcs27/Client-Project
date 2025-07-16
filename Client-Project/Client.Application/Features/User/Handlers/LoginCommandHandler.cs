using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.User.Commands;
using Client.Application.Features.User.Dtos;
using Client.Application.Interfaces;
using MediatR;

namespace Client.Application.Features.User.Handlers
{
    public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponseDto>
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;

        public LoginCommandHandler(IUserRepository userRepository, IJwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task<LoginResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.ValidateUserAsync(request.Dto);

            if (user == null)
            {
                return new LoginResponseDto
                {
                    Token = null,
                    Message = "Invalid username or password."
                };
            }

            var token = _jwtService.GenerateToken(user);
            return new LoginResponseDto
            {
                Token = token,
                Message = "Login successful"
            };
        }
    }

}
