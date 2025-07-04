using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace Client.Application.Features.User.Commands
{ 
    public record DeleteUserCommand(int Id) : IRequest<string>;

}
