"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var database_1 = require("@aller-retour/database");
var update_user_status_dto_1 = require("./dto/update-user-status.dto");
var bcrypt = __importStar(require("bcrypt"));
var UsersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UsersService = _classThis = /** @class */ (function () {
        function UsersService_1() {
        }
        UsersService_1.prototype.findAll = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, page, _b, limit, search, role, status, verified, skip, where, now, _c, total, users;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = filters.page, page = _a === void 0 ? 1 : _a, _b = filters.limit, limit = _b === void 0 ? 10 : _b, search = filters.search, role = filters.role, status = filters.status, verified = filters.verified;
                            skip = (page - 1) * limit;
                            where = {};
                            if (search) {
                                where.OR = [
                                    { fullName: { contains: search, mode: 'insensitive' } },
                                    { phone: { contains: search } },
                                    { email: { contains: search, mode: 'insensitive' } },
                                ];
                            }
                            if (role) {
                                where.role = role;
                            }
                            if (verified !== undefined) {
                                where.phoneVerified = verified === 'true';
                            }
                            if (status) {
                                now = new Date();
                                if (status === 'ACTIVE') {
                                    where.isActive = true;
                                    where.OR = [{ blockedUntil: null }, { blockedUntil: { lt: now } }];
                                }
                                else if (status === 'SUSPENDED') {
                                    where.isActive = false;
                                }
                                else if (status === 'BANNED') {
                                    where.blockedUntil = { gt: now };
                                }
                            }
                            return [4 /*yield*/, Promise.all([
                                    database_1.prisma.user.count({ where: where }),
                                    database_1.prisma.user.findMany({
                                        where: where,
                                        skip: skip,
                                        take: limit,
                                        orderBy: { createdAt: 'desc' },
                                        select: {
                                            id: true,
                                            email: true,
                                            phone: true,
                                            phoneVerified: true,
                                            fullName: true,
                                            avatarUrl: true,
                                            role: true,
                                            isActive: true,
                                            blockedUntil: true,
                                            createdAt: true,
                                            updatedAt: true,
                                            failedAttempts: true,
                                            colisPoints: true,
                                            transportPoints: true,
                                        },
                                    }),
                                ])];
                        case 1:
                            _c = _d.sent(), total = _c[0], users = _c[1];
                            return [2 /*return*/, {
                                    data: users.map(function (user) { return _this.mapUserStatus(user); }),
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        UsersService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var user, mappedUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.user.findUnique({
                                where: { id: id },
                                select: {
                                    id: true,
                                    email: true,
                                    phone: true,
                                    phoneVerified: true,
                                    fullName: true,
                                    avatarUrl: true,
                                    role: true,
                                    isActive: true,
                                    blockedUntil: true,
                                    createdAt: true,
                                    updatedAt: true,
                                    failedAttempts: true,
                                    colisPoints: true,
                                    transportPoints: true,
                                    passwordHash: true, // Only to check if pin is configured
                                },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.NotFoundException('Utilisateur introuvable');
                            }
                            mappedUser = this.mapUserStatus(user);
                            // Add specific fields for detail view
                            return [2 /*return*/, __assign(__assign({}, mappedUser), { hasPinConfigured: !!user.passwordHash, pinLastModified: user.updatedAt })];
                    }
                });
            });
        };
        UsersService_1.prototype.updateStatus = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, data, updatedUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.user.findUnique({ where: { id: id } })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.NotFoundException('Utilisateur introuvable');
                            }
                            data = {};
                            if (dto.action === update_user_status_dto_1.UserStatusAction.ACTIVATE) {
                                data.isActive = true;
                                data.blockedUntil = null;
                            }
                            else if (dto.action === update_user_status_dto_1.UserStatusAction.SUSPEND) {
                                data.isActive = false;
                            }
                            else if (dto.action === update_user_status_dto_1.UserStatusAction.BLOCK) {
                                data.blockedUntil = new Date('2099-12-31T23:59:59.000Z');
                            }
                            return [4 /*yield*/, database_1.prisma.user.update({
                                    where: { id: id },
                                    data: data,
                                    select: {
                                        id: true,
                                        isActive: true,
                                        blockedUntil: true,
                                        updatedAt: true,
                                    },
                                })];
                        case 2:
                            updatedUser = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Statut mis à jour avec succès',
                                    user: this.mapUserStatus(updatedUser),
                                }];
                    }
                });
            });
        };
        UsersService_1.prototype.resetPin = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var user, newPin, passwordHash;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.user.findUnique({ where: { id: id } })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.NotFoundException('Utilisateur introuvable');
                            }
                            newPin = Math.floor(100000 + Math.random() * 900000).toString();
                            return [4 /*yield*/, bcrypt.hash(newPin, 10)];
                        case 2:
                            passwordHash = _a.sent();
                            return [4 /*yield*/, database_1.prisma.user.update({
                                    where: { id: id },
                                    data: { passwordHash: passwordHash },
                                })];
                        case 3:
                            _a.sent();
                            // Dans un cas réel, on enverrait un SMS ici
                            // await smsService.send(user.phone, `Votre nouveau PIN est ${newPin}`);
                            return [2 /*return*/, {
                                    message: "Le code PIN a été réinitialisé. L'utilisateur recevra un SMS."
                                }];
                    }
                });
            });
        };
        UsersService_1.prototype.getUserActivity = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.user.findUnique({ where: { id: id } })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.NotFoundException('Utilisateur introuvable');
                            }
                            // Mock data as requested since we don't have an audit table
                            return [2 /*return*/, [
                                    {
                                        id: '1',
                                        type: 'ACCOUNT_CREATED',
                                        title: 'Création du compte',
                                        description: "L'utilisateur s'est inscrit sur la plateforme.",
                                        createdAt: user.createdAt,
                                    },
                                    {
                                        id: '2',
                                        type: 'PIN_MODIFIED',
                                        title: 'Configuration du code PIN',
                                        description: 'Le code de sécurité a été défini.',
                                        createdAt: user.updatedAt,
                                    }
                                ]];
                    }
                });
            });
        };
        UsersService_1.prototype.mapUserStatus = function (user) {
            var status = 'ACTIVE';
            var now = new Date();
            if (!user.isActive) {
                status = 'SUSPENDED';
            }
            else if (user.blockedUntil && user.blockedUntil > now) {
                status = 'BANNED';
            }
            // Remove raw fields
            var _a = user, isActive = _a.isActive, blockedUntil = _a.blockedUntil, passwordHash = _a.passwordHash, cleanUser = __rest(_a, ["isActive", "blockedUntil", "passwordHash"]);
            return __assign(__assign({}, cleanUser), { status: status });
        };
        return UsersService_1;
    }());
    __setFunctionName(_classThis, "UsersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsersService = _classThis;
}();
exports.UsersService = UsersService;
