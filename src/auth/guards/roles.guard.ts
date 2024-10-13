import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/utils/decorador/roles.decorador';
import { Role } from 'src/utils/enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) return true;
        console.log("-.-.-.");
        console.log(requiredRoles[0].split(','));

        const { user, params } = context.switchToHttp().getRequest();
        console.log(params)
        console.log(user)

        if (requiredRoles[0] == Role.All) {
            if (params && params.id) return (requiredRoles[0].split(',')[0] === user.role || requiredRoles[0].split(',')[1] === user.role) && parseInt(params.id) === user.userId;

            return requiredRoles[0].split(',')[0] === user.role || requiredRoles[0].split(',')[1] === user.role;
        }
        //if (params && params.id) return requiredRoles[0] === user.role && parseInt(params.id) === user.userId;


        return requiredRoles[0] === user.role;
    }
}