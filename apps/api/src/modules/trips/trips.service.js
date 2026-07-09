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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsService = void 0;
var common_1 = require("@nestjs/common");
var database_1 = require("@aller-retour/database");
var bcrypt = __importStar(require("bcrypt"));
var TripsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TripsService = _classThis = /** @class */ (function () {
        function TripsService_1() {
        }
        TripsService_1.prototype.mapToDatabaseCity = function (inputCity) {
            if (!inputCity)
                return undefined;
            var cleanInput = inputCity.split(',')[0].trim().toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]/g, "");
            var databaseCities = [
                'Dakar', 'Touba', 'Thiès', 'Mbour', 'Saint-Louis',
                'Kaolack', 'Ziguinchor', 'Tambacounda', 'Diourbel', 'Louga'
            ];
            for (var _i = 0, databaseCities_1 = databaseCities; _i < databaseCities_1.length; _i++) {
                var dbCity = databaseCities_1[_i];
                var cleanDb = dbCity.toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]/g, "");
                if (cleanInput.includes(cleanDb) || cleanDb.includes(cleanInput)) {
                    return dbCity;
                }
            }
            return inputCity.split(',')[0].trim();
        };
        TripsService_1.prototype.getStation = function (cityName) {
            return __awaiter(this, void 0, void 0, function () {
                var station;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.station.findFirst({ where: { city: cityName } })];
                        case 1:
                            station = _a.sent();
                            if (!!station) return [3 /*break*/, 3];
                            return [4 /*yield*/, database_1.prisma.station.create({
                                    data: { name: "Gare ".concat(cityName), city: cityName, country: 'SN', latitude: 14.6, longitude: -17.4 }
                                })];
                        case 2:
                            station = _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, station.id];
                    }
                });
            });
        };
        TripsService_1.prototype.getRoute = function (originCity, destinationCity, originId, destId) {
            return __awaiter(this, void 0, void 0, function () {
                var route;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.route.findFirst({ where: { originStationId: originId, destinationStationId: destId } })];
                        case 1:
                            route = _a.sent();
                            if (!!route) return [3 /*break*/, 3];
                            return [4 /*yield*/, database_1.prisma.route.create({
                                    data: { name: "".concat(originCity, " - ").concat(destinationCity), originStationId: originId, destinationStationId: destId, distanceKm: 200, estimatedDurationMins: 180, defaultPrice: 5000 }
                                })];
                        case 2:
                            route = _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, route.id];
                    }
                });
            });
        };
        TripsService_1.prototype.searchTrips = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var originCity, destinationCity, date, whereClause, cleanOrigin, cleanDest, routes, now, startOfDay, endOfDay, effectiveStart, fiveMinutesAgo, trips;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            originCity = dto.originCity, destinationCity = dto.destinationCity, date = dto.date;
                            whereClause = {
                                status: database_1.TripStatus.SCHEDULED,
                                isLocked: false,
                            };
                            if (!(originCity && destinationCity)) return [3 /*break*/, 2];
                            cleanOrigin = this.mapToDatabaseCity(originCity);
                            cleanDest = this.mapToDatabaseCity(destinationCity);
                            return [4 /*yield*/, database_1.prisma.route.findMany({
                                    where: {
                                        originStation: { city: cleanOrigin },
                                        destinationStation: { city: cleanDest },
                                    },
                                    select: { id: true }
                                })];
                        case 1:
                            routes = _a.sent();
                            if (routes.length > 0) {
                                whereClause.routeId = { in: routes.map(function (r) { return r.id; }) };
                            }
                            else {
                                return [2 /*return*/, []];
                            }
                            _a.label = 2;
                        case 2:
                            now = new Date();
                            if (date) {
                                startOfDay = new Date(date);
                                if (!isNaN(startOfDay.getTime())) {
                                    startOfDay.setUTCHours(0, 0, 0, 0);
                                    endOfDay = new Date(startOfDay);
                                    endOfDay.setDate(endOfDay.getDate() + 1);
                                    endOfDay.setUTCHours(23, 59, 59, 999);
                                    effectiveStart = startOfDay.getTime() < now.getTime() ? now : startOfDay;
                                    whereClause.departureTime = { gte: effectiveStart, lte: endOfDay };
                                }
                            }
                            else {
                                whereClause.departureTime = { gte: now };
                            }
                            fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                            return [4 /*yield*/, database_1.prisma.trip.findMany({
                                    where: whereClause,
                                    include: {
                                        route: {
                                            include: {
                                                originStation: true,
                                                destinationStation: true,
                                            },
                                        },
                                        vehicle: { select: { plateNumber: true, type: true, capacity: true } },
                                        driver: { select: { user: { select: { phone: true, fullName: true } } } },
                                        bookings: {
                                            select: { id: true },
                                            where: {
                                                OR: [
                                                    { status: { in: ['CONFIRMED', 'BOARDED'] } },
                                                    { status: 'PENDING_PAYMENT', createdAt: { gt: fiveMinutesAgo } }
                                                ]
                                            }
                                        },
                                    },
                                    orderBy: { departureTime: 'asc' },
                                })];
                        case 3:
                            trips = _a.sent();
                            return [2 /*return*/, trips.map(function (trip) {
                                    var _a, _b, _c, _d;
                                    var bookedSeats = trip.bookings.length;
                                    var totalPassengers = trip.initialPassengers + bookedSeats;
                                    return __assign(__assign({}, trip), { availableSeats: Math.max(0, trip.seatsOffered - totalPassengers), passagers: totalPassengers, placesPrises: totalPassengers, seatsOffered: trip.seatsOffered, initialPassengers: trip.initialPassengers, driverName: ((_b = (_a = trip.driver) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.fullName) || null, driverPhone: ((_d = (_c = trip.driver) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.phone) || null });
                                })];
                    }
                });
            });
        };
        TripsService_1.prototype.getManifest = function (tripId, userId, role) {
            return __awaiter(this, void 0, void 0, function () {
                var bookings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.checkTripOwnership(tripId, userId, role)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, database_1.prisma.booking.findMany({
                                    where: { tripId: tripId, status: { in: ['CONFIRMED', 'BOARDED'] } },
                                    include: { user: { select: { fullName: true, phone: true } } },
                                    orderBy: { seatNumber: 'asc' },
                                })];
                        case 2:
                            bookings = _a.sent();
                            return [2 /*return*/, {
                                    tripId: tripId,
                                    totalPassengers: bookings.length,
                                    tickets: bookings.map(function (b) { return ({
                                        id: b.id,
                                        seatNumber: b.seatNumber,
                                        passengerName: b.user.fullName,
                                        passengerPhone: b.user.phone,
                                        qrCodeToken: b.qrCodeToken,
                                        status: b.status,
                                    }); }),
                                }];
                    }
                });
            });
        };
        TripsService_1.prototype.createAlloDakarTrip = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var driverProfile, vehicle, finalDriverId, assignedDriver, _a, originId, destinationId, routeId, trip;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (dto.originCity.trim().toLowerCase() === dto.destinationCity.trim().toLowerCase()) {
                                throw new common_1.BadRequestException("La ville de départ et la ville d'arrivée ne peuvent pas être identiques.");
                            }
                            return [4 /*yield*/, database_1.prisma.driverProfile.findUnique({
                                    where: { userId: userId }
                                })];
                        case 1:
                            driverProfile = _b.sent();
                            if (!driverProfile) {
                                throw new common_1.ForbiddenException("Vous n'avez pas de profil chauffeur.");
                            }
                            if (driverProfile.type === database_1.DriverType.ASSIGNED) {
                                throw new common_1.ForbiddenException("Les chauffeurs assignés ne peuvent pas créer de trajets.");
                            }
                            return [4 /*yield*/, database_1.prisma.vehicle.findUnique({
                                    where: { id: dto.vehicleId }
                                })];
                        case 2:
                            vehicle = _b.sent();
                            if (!vehicle || vehicle.ownerId !== driverProfile.id) {
                                throw new common_1.ForbiddenException("Ce véhicule ne vous appartient pas.");
                            }
                            finalDriverId = driverProfile.id;
                            if (!dto.assignedDriverId) return [3 /*break*/, 4];
                            return [4 /*yield*/, database_1.prisma.driverProfile.findUnique({
                                    where: { id: dto.assignedDriverId }
                                })];
                        case 3:
                            assignedDriver = _b.sent();
                            if (!assignedDriver || assignedDriver.managerId !== driverProfile.id) {
                                throw new common_1.ForbiddenException("Le chauffeur assigné n'est pas sous votre gestion.");
                            }
                            finalDriverId = assignedDriver.id;
                            _b.label = 4;
                        case 4: return [4 /*yield*/, Promise.all([
                                this.getStation(dto.originCity),
                                this.getStation(dto.destinationCity)
                            ])];
                        case 5:
                            _a = _b.sent(), originId = _a[0], destinationId = _a[1];
                            return [4 /*yield*/, this.getRoute(dto.originCity, dto.destinationCity, originId, destinationId)];
                        case 6:
                            routeId = _b.sent();
                            return [4 /*yield*/, database_1.prisma.trip.create({
                                    data: {
                                        routeId: routeId,
                                        vehicleId: dto.vehicleId,
                                        driverId: finalDriverId,
                                        departureTime: dto.departureTime ? new Date(dto.departureTime) : new Date(),
                                        pricePerSeat: dto.pricePerSeat || 5000,
                                        isMarketplace: true,
                                        seatsOffered: dto.placesLibres || 4,
                                        initialPassengers: dto.passagers || 0,
                                        status: database_1.TripStatus.SCHEDULED
                                    }
                                })];
                        case 7:
                            trip = _b.sent();
                            return [2 /*return*/, { success: true, trip: trip }];
                    }
                });
            });
        };
        TripsService_1.prototype.checkTripOwnership = function (tripId, userId, role) {
            return __awaiter(this, void 0, void 0, function () {
                var trip, driverProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (role === database_1.UserRole.SUPER_ADMIN)
                                return [2 /*return*/, true];
                            return [4 /*yield*/, database_1.prisma.trip.findUnique({
                                    where: { id: tripId },
                                    include: { vehicle: true }
                                })];
                        case 1:
                            trip = _a.sent();
                            if (!trip)
                                throw new common_1.NotFoundException('Trajet non trouvé');
                            return [4 /*yield*/, database_1.prisma.driverProfile.findUnique({
                                    where: { userId: userId }
                                })];
                        case 2:
                            driverProfile = _a.sent();
                            if (!driverProfile || trip.vehicle.ownerId !== driverProfile.id) {
                                throw new common_1.ForbiddenException("Vous n'êtes pas autorisé à modifier ce trajet.");
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        TripsService_1.prototype.updateTrip = function (tripId, userId, role, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data, _a, originId, destinationId, _b, driverProfile, vehicle, updatedTrip;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (dto.originCity && dto.destinationCity && dto.originCity.trim().toLowerCase() === dto.destinationCity.trim().toLowerCase()) {
                                throw new common_1.BadRequestException("La ville de départ et la ville d'arrivée ne peuvent pas être identiques.");
                            }
                            return [4 /*yield*/, this.checkTripOwnership(tripId, userId, role)];
                        case 1:
                            _c.sent();
                            data = {};
                            if (!(dto.originCity && dto.destinationCity)) return [3 /*break*/, 4];
                            return [4 /*yield*/, Promise.all([
                                    this.getStation(dto.originCity),
                                    this.getStation(dto.destinationCity)
                                ])];
                        case 2:
                            _a = _c.sent(), originId = _a[0], destinationId = _a[1];
                            _b = data;
                            return [4 /*yield*/, this.getRoute(dto.originCity, dto.destinationCity, originId, destinationId)];
                        case 3:
                            _b.routeId = _c.sent();
                            _c.label = 4;
                        case 4:
                            if (!dto.vehicleId) return [3 /*break*/, 7];
                            return [4 /*yield*/, database_1.prisma.driverProfile.findUnique({ where: { userId: userId } })];
                        case 5:
                            driverProfile = _c.sent();
                            return [4 /*yield*/, database_1.prisma.vehicle.findUnique({ where: { id: dto.vehicleId } })];
                        case 6:
                            vehicle = _c.sent();
                            if (!vehicle || vehicle.ownerId !== (driverProfile === null || driverProfile === void 0 ? void 0 : driverProfile.id)) {
                                throw new common_1.ForbiddenException("Ce véhicule ne vous appartient pas.");
                            }
                            data.vehicleId = dto.vehicleId;
                            _c.label = 7;
                        case 7:
                            if (dto.departureTime)
                                data.departureTime = new Date(dto.departureTime);
                            if (dto.pricePerSeat)
                                data.pricePerSeat = dto.pricePerSeat;
                            if (dto.placesLibres)
                                data.seatsOffered = dto.placesLibres;
                            if (dto.passagers !== undefined)
                                data.initialPassengers = dto.passagers;
                            return [4 /*yield*/, database_1.prisma.trip.update({
                                    where: { id: tripId },
                                    data: data
                                })];
                        case 8:
                            updatedTrip = _c.sent();
                            return [2 /*return*/, { success: true, trip: updatedTrip }];
                    }
                });
            });
        };
        TripsService_1.prototype.deleteTrip = function (tripId, userId, role) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.checkTripOwnership(tripId, userId, role)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 7, , 8]);
                            return [4 /*yield*/, database_1.prisma.booking.deleteMany({ where: { tripId: tripId } })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, database_1.prisma.parcel.deleteMany({ where: { tripId: tripId } })];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, database_1.prisma.seatLock.deleteMany({ where: { tripId: tripId } })];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, database_1.prisma.trip.delete({
                                    where: { id: tripId }
                                })];
                        case 6:
                            _a.sent();
                            return [2 /*return*/, { success: true }];
                        case 7:
                            error_1 = _a.sent();
                            return [2 /*return*/, { success: false, error: (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Erreur lors de la suppression de la mission' }];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        TripsService_1.prototype.getPopularPrices = function (origin, destination) {
            return __awaiter(this, void 0, void 0, function () {
                var o, d, popularTrips, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!origin || !destination) {
                                return [2 /*return*/, { prices: [] }];
                            }
                            o = this.mapToDatabaseCity(origin) || origin;
                            d = this.mapToDatabaseCity(destination) || destination;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, database_1.prisma.trip.groupBy({
                                    by: ['pricePerSeat'],
                                    where: {
                                        OR: [
                                            {
                                                route: {
                                                    originStation: { city: { equals: o, mode: 'insensitive' } },
                                                    destinationStation: { city: { equals: d, mode: 'insensitive' } },
                                                }
                                            },
                                            {
                                                route: {
                                                    originStation: { city: { equals: d, mode: 'insensitive' } },
                                                    destinationStation: { city: { equals: o, mode: 'insensitive' } },
                                                }
                                            }
                                        ]
                                    },
                                    _count: { pricePerSeat: true },
                                    orderBy: { _count: { pricePerSeat: 'desc' } },
                                    take: 2,
                                })];
                        case 2:
                            popularTrips = _a.sent();
                            return [2 /*return*/, { prices: popularTrips.map(function (p) { return p.pricePerSeat; }) }];
                        case 3:
                            error_2 = _a.sent();
                            console.error('Error fetching popular prices:', error_2);
                            return [2 /*return*/, { prices: [] }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        TripsService_1.prototype.toggleLock = function (tripId, userId, role, code) {
            return __awaiter(this, void 0, void 0, function () {
                var existingTrip, callerUser, isPinValid, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.checkTripOwnership(tripId, userId, role)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, database_1.prisma.trip.findUnique({
                                    where: { id: tripId }
                                })];
                        case 2:
                            existingTrip = _a.sent();
                            if (!existingTrip) {
                                throw new common_1.NotFoundException('Trajet non trouvé');
                            }
                            if (!!existingTrip.isLocked) return [3 /*break*/, 7];
                            if (!(role !== database_1.UserRole.SUPER_ADMIN)) return [3 /*break*/, 7];
                            if (!code) {
                                throw new common_1.BadRequestException('Un code PIN de sécurité est requis pour verrouiller le trajet.');
                            }
                            return [4 /*yield*/, database_1.prisma.user.findUnique({
                                    where: { id: userId },
                                    select: { passwordHash: true }
                                })];
                        case 3:
                            callerUser = _a.sent();
                            if (!callerUser || !callerUser.passwordHash) {
                                throw new common_1.BadRequestException('Le code PIN saisi est incorrect.');
                            }
                            isPinValid = false;
                            if (!callerUser.passwordHash.startsWith('$2')) return [3 /*break*/, 5];
                            return [4 /*yield*/, bcrypt.compare(code, callerUser.passwordHash)];
                        case 4:
                            isPinValid = _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            isPinValid = callerUser.passwordHash === code;
                            _a.label = 6;
                        case 6:
                            if (!isPinValid) {
                                throw new common_1.BadRequestException('Le code PIN saisi est incorrect.');
                            }
                            _a.label = 7;
                        case 7: return [4 /*yield*/, database_1.prisma.trip.update({
                                where: { id: tripId },
                                data: { isLocked: !existingTrip.isLocked }
                            })];
                        case 8:
                            updated = _a.sent();
                            return [2 /*return*/, { success: true, isLocked: updated.isLocked }];
                    }
                });
            });
        };
        TripsService_1.prototype.getTransferTargets = function (tripId, userId, role) {
            return __awaiter(this, void 0, void 0, function () {
                var trip, fiveMinutesAgo, departureDate, startOfDay, endOfDay, alternativeTrips;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.checkTripOwnership(tripId, userId, role)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, database_1.prisma.trip.findUnique({
                                    where: { id: tripId },
                                    include: { route: true, vehicle: true }
                                })];
                        case 2:
                            trip = _a.sent();
                            if (!trip) {
                                return [2 /*return*/, []];
                            }
                            fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                            departureDate = new Date(trip.departureTime);
                            startOfDay = new Date(departureDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
                            endOfDay = new Date(departureDate.toISOString().split('T')[0] + 'T23:59:59.999Z');
                            return [4 /*yield*/, database_1.prisma.trip.findMany({
                                    where: {
                                        routeId: trip.routeId,
                                        id: { not: tripId },
                                        status: { in: [database_1.TripStatus.SCHEDULED, database_1.TripStatus.BOARDING] },
                                        departureTime: { gte: startOfDay, lte: endOfDay }
                                    },
                                    include: {
                                        vehicle: { select: { plateNumber: true, type: true, capacity: true } },
                                        driver: { select: { user: { select: { fullName: true, phone: true } } } },
                                        bookings: {
                                            where: {
                                                OR: [
                                                    { status: { in: ['CONFIRMED', 'BOARDED'] } },
                                                    { status: 'PENDING_PAYMENT', createdAt: { gt: fiveMinutesAgo } }
                                                ]
                                            }
                                        }
                                    }
                                })];
                        case 3:
                            alternativeTrips = _a.sent();
                            return [2 /*return*/, alternativeTrips.map(function (alt) {
                                    var _a, _b, _c, _d;
                                    var bookedSeats = alt.bookings.length;
                                    var totalPassengers = alt.initialPassengers + bookedSeats;
                                    return {
                                        id: alt.id,
                                        departureTime: alt.departureTime,
                                        status: alt.status,
                                        pricePerSeat: alt.pricePerSeat,
                                        seatsOffered: alt.seatsOffered,
                                        initialPassengers: alt.initialPassengers,
                                        availableSeats: Math.max(0, alt.seatsOffered - totalPassengers),
                                        driverName: ((_b = (_a = alt.driver) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.fullName) || 'Chauffeur Inconnu',
                                        driverPhone: ((_d = (_c = alt.driver) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.phone) || '',
                                        plateNumber: alt.vehicle.plateNumber,
                                        isLocked: alt.isLocked,
                                    };
                                })];
                    }
                });
            });
        };
        return TripsService_1;
    }());
    __setFunctionName(_classThis, "TripsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TripsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TripsService = _classThis;
}();
exports.TripsService = TripsService;
