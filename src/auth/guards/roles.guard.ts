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

        const { user, params } = context.switchToHttp().getRequest();

        const allRoles = Role.All.split(',');

        return requiredRoles.includes(Role.All)
          ? allRoles.includes(user.role)
          : requiredRoles.includes(user.role);

        /*if (params?.id) {
            return userHasAccess && parseInt(params.id) === user.userId;
        }*/

    }
}