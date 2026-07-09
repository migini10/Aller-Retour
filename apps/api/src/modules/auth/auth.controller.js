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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.ResetPasswordDto = exports.ForgotPasswordDto = exports.RegisterDto = exports.LoginDto = exports.VerifyPinDto = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var passport_1 = require("@nestjs/passport");
var class_validator_1 = require("class-validator");
var rbac_guard_1 = require("../../core/rbac/rbac.guard");
var roles_decorator_1 = require("../../core/rbac/roles.decorator");
var database_1 = require("@aller-retour/database");
var VerifyPinDto = function () {
    var _a;
    var _pin_decorators;
    var _pin_initializers = [];
    var _pin_extraInitializers = [];
    return _a = /** @class */ (function () {
            function VerifyPinDto() {
                this.pin = __runInitializers(this, _pin_initializers, void 0);
                __runInitializers(this, _pin_extraInitializers);
            }
            return VerifyPinDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _pin_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _pin_decorators, { kind: "field", name: "pin", static: false, private: false, access: { has: function (obj) { return "pin" in obj; }, get: function (obj) { return obj.pin; }, set: function (obj, value) { obj.pin = value; } }, metadata: _metadata }, _pin_initializers, _pin_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.VerifyPinDto = VerifyPinDto;
var LoginDto = function () {
    var _a;
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _pin_decorators;
    var _pin_initializers = [];
    var _pin_extraInitializers = [];
    return _a = /** @class */ (function () {
            function LoginDto() {
                this.phone = __runInitializers(this, _phone_initializers, void 0);
                this.pin = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _pin_initializers, void 0));
                __runInitializers(this, _pin_extraInitializers);
            }
            return LoginDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _phone_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _pin_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _pin_decorators, { kind: "field", name: "pin", static: false, private: false, access: { has: function (obj) { return "pin" in obj; }, get: function (obj) { return obj.pin; }, set: function (obj, value) { obj.pin = value; } }, metadata: _metadata }, _pin_initializers, _pin_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.LoginDto = LoginDto;
var RegisterDto = function () {
    var _a;
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _fullName_decorators;
    var _fullName_initializers = [];
    var _fullName_extraInitializers = [];
    var _pin_decorators;
    var _pin_initializers = [];
    var _pin_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RegisterDto() {
                this.phone = __runInitializers(this, _phone_initializers, void 0);
                this.fullName = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _fullName_initializers, void 0));
                this.pin = (__runInitializers(this, _fullName_extraInitializers), __runInitializers(this, _pin_initializers, void 0));
                __runInitializers(this, _pin_extraInitializers);
            }
            return RegisterDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _phone_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _fullName_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _pin_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.Length)(6, 6)];
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _fullName_decorators, { kind: "field", name: "fullName", static: false, private: false, access: { has: function (obj) { return "fullName" in obj; }, get: function (obj) { return obj.fullName; }, set: function (obj, value) { obj.fullName = value; } }, metadata: _metadata }, _fullName_initializers, _fullName_extraInitializers);
            __esDecorate(null, null, _pin_decorators, { kind: "field", name: "pin", static: false, private: false, access: { has: function (obj) { return "pin" in obj; }, get: function (obj) { return obj.pin; }, set: function (obj, value) { obj.pin = value; } }, metadata: _metadata }, _pin_initializers, _pin_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RegisterDto = RegisterDto;
var ForgotPasswordDto = function () {
    var _a;
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ForgotPasswordDto() {
                this.phone = __runInitializers(this, _phone_initializers, void 0);
                __runInitializers(this, _phone_extraInitializers);
            }
            return ForgotPasswordDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _phone_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ForgotPasswordDto = ForgotPasswordDto;
var ResetPasswordDto = function () {
    var _a;
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _code_decorators;
    var _code_initializers = [];
    var _code_extraInitializers = [];
    var _newPin_decorators;
    var _newPin_initializers = [];
    var _newPin_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ResetPasswordDto() {
                this.phone = __runInitializers(this, _phone_initializers, void 0);
                this.code = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _code_initializers, void 0));
                this.newPin = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _newPin_initializers, void 0));
                __runInitializers(this, _newPin_extraInitializers);
            }
            return ResetPasswordDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _phone_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _code_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.Length)(6, 6)];
            _newPin_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.Length)(6, 6)];
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: function (obj) { return "code" in obj; }, get: function (obj) { return obj.code; }, set: function (obj, value) { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
            __esDecorate(null, null, _newPin_decorators, { kind: "field", name: "newPin", static: false, private: false, access: { has: function (obj) { return "newPin" in obj; }, get: function (obj) { return obj.newPin; }, set: function (obj, value) { obj.newPin = value; } }, metadata: _metadata }, _newPin_initializers, _newPin_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ResetPasswordDto = ResetPasswordDto;
var AuthController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Authentication'), (0, common_1.Controller)('auth')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _register_decorators;
    var _loginMobile_decorators;
    var _unblock_decorators;
    var _forgotPassword_decorators;
    var _resetPassword_decorators;
    var _verifyPin_decorators;
    var AuthController = _classThis = /** @class */ (function () {
        function AuthController_1(authService) {
            this.authService = (__runInitializers(this, _instanceExtraInitializers), authService);
        }
        AuthController_1.prototype.register = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.registerPassenger(dto.phone, dto.fullName, dto.pin)];
                });
            });
        };
        AuthController_1.prototype.loginMobile = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.loginWithMobile(dto.phone, dto.pin)];
                });
            });
        };
        AuthController_1.prototype.unblock = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.unblockUser(dto.phone)];
                });
            });
        };
        AuthController_1.prototype.forgotPassword = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.sendForgotPasswordOtp(dto.phone)];
                });
            });
        };
        AuthController_1.prototype.resetPassword = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.resetPasswordWithOtp(dto.phone, dto.code, dto.newPin)];
                });
            });
        };
        AuthController_1.prototype.verifyPin = function (req, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.verifyUserPin(req.user.id, dto.pin)];
                });
            });
        };
        return AuthController_1;
    }());
    __setFunctionName(_classThis, "AuthController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _register_decorators = [(0, common_1.Post)('register'), (0, swagger_1.ApiOperation)({ summary: 'Enregistrer un nouveau voyageur via Mobile' })];
        _loginMobile_decorators = [(0, common_1.Post)('login-mobile'), (0, swagger_1.ApiOperation)({ summary: 'Connexion par numéro de téléphone et PIN Wave/OM' })];
        _unblock_decorators = [(0, common_1.Post)('unblock'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Débloquer un compte utilisateur (Service Client)' })];
        _forgotPassword_decorators = [(0, common_1.Post)('forgot-password'), (0, swagger_1.ApiOperation)({ summary: 'Demander un code OTP de réinitialisation de PIN' })];
        _resetPassword_decorators = [(0, common_1.Post)('reset-password'), (0, swagger_1.ApiOperation)({ summary: 'Réinitialiser le PIN à l\'aide du code OTP' })];
        _verifyPin_decorators = [(0, common_1.Post)('verify-pin'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Vérifier le code PIN de l\'utilisateur connecté' })];
        __esDecorate(_classThis, null, _register_decorators, { kind: "method", name: "register", static: false, private: false, access: { has: function (obj) { return "register" in obj; }, get: function (obj) { return obj.register; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _loginMobile_decorators, { kind: "method", name: "loginMobile", static: false, private: false, access: { has: function (obj) { return "loginMobile" in obj; }, get: function (obj) { return obj.loginMobile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _unblock_decorators, { kind: "method", name: "unblock", static: false, private: false, access: { has: function (obj) { return "unblock" in obj; }, get: function (obj) { return obj.unblock; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _forgotPassword_decorators, { kind: "method", name: "forgotPassword", static: false, private: false, access: { has: function (obj) { return "forgotPassword" in obj; }, get: function (obj) { return obj.forgotPassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resetPassword_decorators, { kind: "method", name: "resetPassword", static: false, private: false, access: { has: function (obj) { return "resetPassword" in obj; }, get: function (obj) { return obj.resetPassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyPin_decorators, { kind: "method", name: "verifyPin", static: false, private: false, access: { has: function (obj) { return "verifyPin" in obj; }, get: function (obj) { return obj.verifyPin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthController = _classThis;
}();
exports.AuthController = AuthController;
