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
exports.DriversService = void 0;
var common_1 = require("@nestjs/common");
var database_1 = require("@aller-retour/database");
var DriversService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DriversService = _classThis = /** @class */ (function () {
        function DriversService_1() {
        }
        DriversService_1.prototype.findAll = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, page, _b, limit, search, kycStatus, hasVehicle, isActive, skip, where, _c, total, drivers;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = filters.page, page = _a === void 0 ? 1 : _a, _b = filters.limit, limit = _b === void 0 ? 10 : _b, search = filters.search, kycStatus = filters.kycStatus, hasVehicle = filters.hasVehicle, isActive = filters.isActive;
                            skip = (page - 1) * limit;
                            where = {};
                            if (search) {
                                where.user = {
                                    OR: [
                                        { fullName: { contains: search, mode: 'insensitive' } },
                                        { phone: { contains: search } },
                                        { email: { contains: search, mode: 'insensitive' } },
                                    ],
                                };
                            }
                            if (kycStatus) {
                                where.kycStatus = kycStatus;
                            }
                            if (hasVehicle === 'true') {
                                where.vehicles = { some: {} };
                            }
                            else if (hasVehicle === 'false') {
                                where.vehicles = { none: {} };
                            }
                            if (isActive !== undefined) {
                                if (!where.user)
                                    where.user = {};
                                where.user.isActive = isActive === 'true';
                            }
                            return [4 /*yield*/, Promise.all([
                                    database_1.prisma.driverProfile.count({ where: where }),
                                    database_1.prisma.driverProfile.findMany({
                                        where: where,
                                        skip: skip,
                                        take: limit,
                                        orderBy: { createdAt: 'desc' },
                                        include: {
                                            user: {
                                                select: {
                                                    fullName: true,
                                                    phone: true,
                                                    email: true,
                                                    avatarUrl: true,
                                                    isActive: true,
                                                },
                                            },
                                            _count: {
                                                select: { vehicles: true, trips: true },
                                            },
                                        },
                                    }),
                                ])];
                        case 1:
                            _c = _d.sent(), total = _c[0], drivers = _c[1];
                            return [2 /*return*/, {
                                    data: drivers.map(function (d) {
                                        var _a, _b, _c, _d, _e, _f;
                                        return ({
                                            id: d.id,
                                            userId: d.userId,
                                            type: d.type,
                                            fullName: (_a = d.user) === null || _a === void 0 ? void 0 : _a.fullName,
                                            phone: (_b = d.user) === null || _b === void 0 ? void 0 : _b.phone,
                                            email: (_c = d.user) === null || _c === void 0 ? void 0 : _c.email,
                                            avatarUrl: (_d = d.user) === null || _d === void 0 ? void 0 : _d.avatarUrl,
                                            isActive: (_e = d.user) === null || _e === void 0 ? void 0 : _e.isActive,
                                            kycStatus: d.kycStatus,
                                            rating: d.rating,
                                            totalTrips: d.totalTrips,
                                            vehiclesCount: ((_f = d._count) === null || _f === void 0 ? void 0 : _f.vehicles) || 0,
                                            createdAt: d.createdAt,
                                        });
                                    }),
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
        DriversService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var driver;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.driverProfile.findUnique({
                                where: { id: id },
                                include: {
                                    user: {
                                        select: {
                                            fullName: true,
                                            phone: true,
                                            email: true,
                                            avatarUrl: true,
                                            isActive: true,
                                            createdAt: true,
                                        },
                                    },
                                    manager: {
                                        include: {
                                            user: { select: { fullName: true, phone: true } },
                                        },
                                    },
                                    employees: {
                                        include: {
                                            user: { select: { fullName: true, phone: true } },
                                        },
                                    },
                                    vehicles: true,
                                },
                            })];
                        case 1:
                            driver = _a.sent();
                            if (!driver) {
                                throw new common_1.NotFoundException('Chauffeur introuvable');
                            }
                            return [2 /*return*/, driver];
                    }
                });
            });
        };
        DriversService_1.prototype.updateKyc = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var driver;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.driverProfile.update({
                                where: { id: id },
                                data: {
                                    kycStatus: dto.status,
                                    isVerified: dto.status === database_1.KYCStatus.VERIFIED,
                                },
                            })];
                        case 1:
                            driver = _a.sent();
                            return [2 /*return*/, driver];
                    }
                });
            });
        };
        DriversService_1.prototype.getVehicles = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var vehicles;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.vehicle.findMany({
                                where: { ownerId: id },
                            })];
                        case 1:
                            vehicles = _a.sent();
                            return [2 /*return*/, vehicles];
                    }
                });
            });
        };
        DriversService_1.prototype.updateVehicle = function (id, vehicleId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var vehicle, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.vehicle.findFirst({
                                where: { id: vehicleId, ownerId: id },
                            })];
                        case 1:
                            vehicle = _a.sent();
                            if (!vehicle) {
                                throw new common_1.NotFoundException("Véhicule introuvable ou n'appartient pas à ce chauffeur");
                            }
                            data = {};
                            if (dto.status)
                                data.status = dto.status;
                            if (dto.insuranceExpiry)
                                data.insuranceExpiry = new Date(dto.insuranceExpiry);
                            if (dto.inspectionExpiry)
                                data.inspectionExpiry = new Date(dto.inspectionExpiry);
                            return [2 /*return*/, database_1.prisma.vehicle.update({
                                    where: { id: vehicleId },
                                    data: data,
                                })];
                    }
                });
            });
        };
        DriversService_1.prototype.getEarnings = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var driver;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.driverProfile.findUnique({ where: { id: id } })];
                        case 1:
                            driver = _a.sent();
                            if (!driver)
                                throw new common_1.NotFoundException('Chauffeur introuvable');
                            return [2 /*return*/, database_1.prisma.driverEarning.findMany({
                                    where: { driverId: driver.userId },
                                    include: {
                                        booking: {
                                            include: {
                                                trip: {
                                                    include: { route: true },
                                                },
                                            },
                                        },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                    take: 50,
                                })];
                    }
                });
            });
        };
        DriversService_1.prototype.getReviews = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var driver;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.driverProfile.findUnique({ where: { id: id } })];
                        case 1:
                            driver = _a.sent();
                            if (!driver)
                                throw new common_1.NotFoundException('Chauffeur introuvable');
                            return [2 /*return*/, database_1.prisma.review.findMany({
                                    where: { receiverId: driver.userId },
                                    include: {
                                        author: {
                                            select: { fullName: true, avatarUrl: true },
                                        },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                    take: 50,
                                })];
                    }
                });
            });
        };
        return DriversService_1;
    }());
    __setFunctionName(_classThis, "DriversService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DriversService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DriversService = _classThis;
}();
exports.DriversService = DriversService;
