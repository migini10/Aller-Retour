"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacGuard = void 0;
var common_1 = require("@nestjs/common");
var roles_decorator_1 = require("./roles.decorator");
var permissions_decorator_1 = require("./permissions.decorator");
// Définition de la carte des permissions par rôle
var RolePermissions = {
    SUPER_ADMIN: ['*'], // Accès total sans restriction
    DRIVER: [
        'trips:manifest_download', 'bookings:scan', 'trips:marketplace_publish'
    ],
    PASSENGER: [
        'bookings:create', 'bookings:read_self', 'bookings:read', 'bookings:update'
    ]
};
var RbacGuard = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RbacGuard = _classThis = /** @class */ (function () {
        function RbacGuard_1(reflector) {
            this.reflector = reflector;
        }
        RbacGuard_1.prototype.canActivate = function (context) {
            var requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            var requiredPermissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (!requiredRoles && !requiredPermissions) {
                return true; // Endpoint public ou protégé par d'autres guards
            }
            var request = context.switchToHttp().getRequest();
            var user = request.user;
            if (!user) {
                throw new common_1.ForbiddenException("Utilisateur non authentifié.");
            }
            var userRole = user.role;
            // 1. Vérification des Rôles
            if (requiredRoles && requiredRoles.length > 0) {
                var hasRole = requiredRoles.includes(userRole) || userRole === 'SUPER_ADMIN';
                if (!hasRole) {
                    throw new common_1.ForbiddenException("Acc\u00E8s refus\u00E9. R\u00F4le requis: ".concat(requiredRoles.join(', '), "."));
                }
            }
            // 2. Vérification des Permissions Unitaires
            if (requiredPermissions && requiredPermissions.length > 0) {
                if (userRole === 'SUPER_ADMIN')
                    return true;
                var userPerms_1 = RolePermissions[userRole] || [];
                var hasPermission = requiredPermissions.every(function (perm) { return userPerms_1.includes(perm); });
                if (!hasPermission) {
                    throw new common_1.ForbiddenException("Acc\u00E8s refus\u00E9. Permission requise: ".concat(requiredPermissions.join(', '), "."));
                }
            }
            return true;
        };
        return RbacGuard_1;
    }());
    __setFunctionName(_classThis, "RbacGuard");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RbacGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RbacGuard = _classThis;
}();
exports.RbacGuard = RbacGuard;
