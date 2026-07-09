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
exports.BookingsController = exports.CreateBookingDto = exports.HideBookingsDto = exports.TransferBookingsDto = exports.CancelBookingDto = exports.GetBookingsFilterDto = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var passport_1 = require("@nestjs/passport");
var rbac_guard_1 = require("../../core/rbac/rbac.guard");
var roles_decorator_1 = require("../../core/rbac/roles.decorator");
var permissions_decorator_1 = require("../../core/rbac/permissions.decorator");
var database_1 = require("@aller-retour/database");
var class_validator_1 = require("class-validator");
var GetBookingsFilterDto = function () {
    var _a;
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _paymentStatus_decorators;
    var _paymentStatus_initializers = [];
    var _paymentStatus_extraInitializers = [];
    var _tripId_decorators;
    var _tripId_initializers = [];
    var _tripId_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _dateFrom_decorators;
    var _dateFrom_initializers = [];
    var _dateFrom_extraInitializers = [];
    var _dateTo_decorators;
    var _dateTo_initializers = [];
    var _dateTo_extraInitializers = [];
    return _a = /** @class */ (function () {
            function GetBookingsFilterDto() {
                this.page = __runInitializers(this, _page_initializers, void 0);
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                this.search = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                this.status = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.paymentStatus = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _paymentStatus_initializers, void 0));
                this.tripId = (__runInitializers(this, _paymentStatus_extraInitializers), __runInitializers(this, _tripId_initializers, void 0));
                this.userId = (__runInitializers(this, _tripId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.dateFrom = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _dateFrom_initializers, void 0));
                this.dateTo = (__runInitializers(this, _dateFrom_extraInitializers), __runInitializers(this, _dateTo_initializers, void 0));
                __runInitializers(this, _dateTo_extraInitializers);
            }
            return GetBookingsFilterDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _page_decorators = [(0, class_validator_1.IsOptional)()];
            _limit_decorators = [(0, class_validator_1.IsOptional)()];
            _search_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _paymentStatus_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _tripId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _userId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _dateFrom_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _dateTo_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _paymentStatus_decorators, { kind: "field", name: "paymentStatus", static: false, private: false, access: { has: function (obj) { return "paymentStatus" in obj; }, get: function (obj) { return obj.paymentStatus; }, set: function (obj, value) { obj.paymentStatus = value; } }, metadata: _metadata }, _paymentStatus_initializers, _paymentStatus_extraInitializers);
            __esDecorate(null, null, _tripId_decorators, { kind: "field", name: "tripId", static: false, private: false, access: { has: function (obj) { return "tripId" in obj; }, get: function (obj) { return obj.tripId; }, set: function (obj, value) { obj.tripId = value; } }, metadata: _metadata }, _tripId_initializers, _tripId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _dateFrom_decorators, { kind: "field", name: "dateFrom", static: false, private: false, access: { has: function (obj) { return "dateFrom" in obj; }, get: function (obj) { return obj.dateFrom; }, set: function (obj, value) { obj.dateFrom = value; } }, metadata: _metadata }, _dateFrom_initializers, _dateFrom_extraInitializers);
            __esDecorate(null, null, _dateTo_decorators, { kind: "field", name: "dateTo", static: false, private: false, access: { has: function (obj) { return "dateTo" in obj; }, get: function (obj) { return obj.dateTo; }, set: function (obj, value) { obj.dateTo = value; } }, metadata: _metadata }, _dateTo_initializers, _dateTo_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.GetBookingsFilterDto = GetBookingsFilterDto;
var CancelBookingDto = function () {
    var _a;
    var _secretCode_decorators;
    var _secretCode_initializers = [];
    var _secretCode_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CancelBookingDto() {
                this.secretCode = __runInitializers(this, _secretCode_initializers, void 0);
                __runInitializers(this, _secretCode_extraInitializers);
            }
            return CancelBookingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _secretCode_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _secretCode_decorators, { kind: "field", name: "secretCode", static: false, private: false, access: { has: function (obj) { return "secretCode" in obj; }, get: function (obj) { return obj.secretCode; }, set: function (obj, value) { obj.secretCode = value; } }, metadata: _metadata }, _secretCode_initializers, _secretCode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CancelBookingDto = CancelBookingDto;
var TransferBookingsDto = function () {
    var _a;
    var _bookingIds_decorators;
    var _bookingIds_initializers = [];
    var _bookingIds_extraInitializers = [];
    var _targetTripId_decorators;
    var _targetTripId_initializers = [];
    var _targetTripId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function TransferBookingsDto() {
                this.bookingIds = __runInitializers(this, _bookingIds_initializers, void 0);
                this.targetTripId = (__runInitializers(this, _bookingIds_extraInitializers), __runInitializers(this, _targetTripId_initializers, void 0));
                __runInitializers(this, _targetTripId_extraInitializers);
            }
            return TransferBookingsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _bookingIds_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsNotEmpty)()];
            _targetTripId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _bookingIds_decorators, { kind: "field", name: "bookingIds", static: false, private: false, access: { has: function (obj) { return "bookingIds" in obj; }, get: function (obj) { return obj.bookingIds; }, set: function (obj, value) { obj.bookingIds = value; } }, metadata: _metadata }, _bookingIds_initializers, _bookingIds_extraInitializers);
            __esDecorate(null, null, _targetTripId_decorators, { kind: "field", name: "targetTripId", static: false, private: false, access: { has: function (obj) { return "targetTripId" in obj; }, get: function (obj) { return obj.targetTripId; }, set: function (obj, value) { obj.targetTripId = value; } }, metadata: _metadata }, _targetTripId_initializers, _targetTripId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.TransferBookingsDto = TransferBookingsDto;
var HideBookingsDto = function () {
    var _a;
    var _bookingIds_decorators;
    var _bookingIds_initializers = [];
    var _bookingIds_extraInitializers = [];
    return _a = /** @class */ (function () {
            function HideBookingsDto() {
                this.bookingIds = __runInitializers(this, _bookingIds_initializers, void 0);
                __runInitializers(this, _bookingIds_extraInitializers);
            }
            return HideBookingsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _bookingIds_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _bookingIds_decorators, { kind: "field", name: "bookingIds", static: false, private: false, access: { has: function (obj) { return "bookingIds" in obj; }, get: function (obj) { return obj.bookingIds; }, set: function (obj, value) { obj.bookingIds = value; } }, metadata: _metadata }, _bookingIds_initializers, _bookingIds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.HideBookingsDto = HideBookingsDto;
var CreateBookingDto = function () {
    var _a;
    var _tripId_decorators;
    var _tripId_initializers = [];
    var _tripId_extraInitializers = [];
    var _seatNumber_decorators;
    var _seatNumber_initializers = [];
    var _seatNumber_extraInitializers = [];
    var _passengersCount_decorators;
    var _passengersCount_initializers = [];
    var _passengersCount_extraInitializers = [];
    var _paymentMethod_decorators;
    var _paymentMethod_initializers = [];
    var _paymentMethod_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateBookingDto() {
                this.tripId = __runInitializers(this, _tripId_initializers, void 0);
                this.seatNumber = (__runInitializers(this, _tripId_extraInitializers), __runInitializers(this, _seatNumber_initializers, void 0));
                this.passengersCount = (__runInitializers(this, _seatNumber_extraInitializers), __runInitializers(this, _passengersCount_initializers, void 0));
                this.paymentMethod = (__runInitializers(this, _passengersCount_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
                __runInitializers(this, _paymentMethod_extraInitializers);
            }
            return CreateBookingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _tripId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _seatNumber_decorators = [(0, class_validator_1.IsInt)()];
            _passengersCount_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.IsOptional)()];
            _paymentMethod_decorators = [(0, class_validator_1.IsEnum)(database_1.PaymentMethod)];
            __esDecorate(null, null, _tripId_decorators, { kind: "field", name: "tripId", static: false, private: false, access: { has: function (obj) { return "tripId" in obj; }, get: function (obj) { return obj.tripId; }, set: function (obj, value) { obj.tripId = value; } }, metadata: _metadata }, _tripId_initializers, _tripId_extraInitializers);
            __esDecorate(null, null, _seatNumber_decorators, { kind: "field", name: "seatNumber", static: false, private: false, access: { has: function (obj) { return "seatNumber" in obj; }, get: function (obj) { return obj.seatNumber; }, set: function (obj, value) { obj.seatNumber = value; } }, metadata: _metadata }, _seatNumber_initializers, _seatNumber_extraInitializers);
            __esDecorate(null, null, _passengersCount_decorators, { kind: "field", name: "passengersCount", static: false, private: false, access: { has: function (obj) { return "passengersCount" in obj; }, get: function (obj) { return obj.passengersCount; }, set: function (obj, value) { obj.passengersCount = value; } }, metadata: _metadata }, _passengersCount_initializers, _passengersCount_extraInitializers);
            __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: function (obj) { return "paymentMethod" in obj; }, get: function (obj) { return obj.paymentMethod; }, set: function (obj, value) { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateBookingDto = CreateBookingDto;
var BookingsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Bookings & QR Tickets'), (0, common_1.Controller)('bookings'), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getAllBookings_decorators;
    var _create_decorators;
    var _verifyQr_decorators;
    var _getStatus_decorators;
    var _getMyTickets_decorators;
    var _hideTickets_decorators;
    var _cancelBooking_decorators;
    var _transfer_decorators;
    var _adminCancel_decorators;
    var _getById_decorators;
    var BookingsController = _classThis = /** @class */ (function () {
        function BookingsController_1(bookingsService) {
            this.bookingsService = (__runInitializers(this, _instanceExtraInitializers), bookingsService);
        }
        BookingsController_1.prototype.getAllBookings = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.getAllBookings(filters)];
                });
            });
        };
        BookingsController_1.prototype.create = function (req, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.createBooking(req.user.id, dto.tripId, dto.seatNumber, dto.paymentMethod, dto.passengersCount || 1)];
                });
            });
        };
        BookingsController_1.prototype.verifyQr = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.verifyQrAtBoarding(token)];
                });
            });
        };
        BookingsController_1.prototype.getStatus = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Cette route peut être appelée publiquement ou nécessiter le token, mais comme c'est pour du polling web/mobile rapide:
                    return [2 /*return*/, this.bookingsService.getBookingStatus(id)];
                });
            });
        };
        BookingsController_1.prototype.getMyTickets = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.getUserBookings(req.user.id)];
                });
            });
        };
        BookingsController_1.prototype.hideTickets = function (req, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.hideBookings(req.user.id, dto.bookingIds)];
                });
            });
        };
        BookingsController_1.prototype.cancelBooking = function (id, req, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.cancelBooking(id, req.user.id, dto.secretCode)];
                });
            });
        };
        BookingsController_1.prototype.transfer = function (req, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.transferBookings(req.user.id, dto.bookingIds, dto.targetTripId)];
                });
            });
        };
        BookingsController_1.prototype.adminCancel = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.adminCancelBooking(id)];
                });
            });
        };
        BookingsController_1.prototype.getById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.getBookingById(id)];
                });
            });
        };
        return BookingsController_1;
    }());
    __setFunctionName(_classThis, "BookingsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getAllBookings_decorators = [(0, common_1.Get)(), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN), (0, permissions_decorator_1.Permissions)('bookings:read'), (0, swagger_1.ApiOperation)({ summary: 'Lister et filtrer toutes les réservations (Admin)' })];
        _create_decorators = [(0, common_1.Post)(), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.PASSENGER), (0, permissions_decorator_1.Permissions)('bookings:create'), (0, swagger_1.ApiOperation)({ summary: 'Réserver un siège sur un trajet' })];
        _verifyQr_decorators = [(0, common_1.Post)('verify-qr/:token'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.DRIVER, database_1.UserRole.SUPER_ADMIN), (0, permissions_decorator_1.Permissions)('bookings:scan'), (0, swagger_1.ApiOperation)({ summary: 'Scanner et valider un billet QR Code en gare' })];
        _getStatus_decorators = [(0, common_1.Get)(':id/status'), (0, swagger_1.ApiOperation)({ summary: 'Vérifier le statut de paiement d\'une réservation (Polling)' })];
        _getMyTickets_decorators = [(0, common_1.Get)('my-tickets'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.PASSENGER), (0, permissions_decorator_1.Permissions)('bookings:read'), (0, swagger_1.ApiOperation)({ summary: 'Récupérer les billets (QR Codes) de l\'utilisateur connecté' })];
        _hideTickets_decorators = [(0, common_1.Post)('hide'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.PASSENGER), (0, permissions_decorator_1.Permissions)('bookings:update'), (0, swagger_1.ApiOperation)({ summary: 'Masquer (supprimer) définitivement un ou plusieurs billets de la vue utilisateur' })];
        _cancelBooking_decorators = [(0, common_1.Post)(':id/cancel'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.PASSENGER), (0, permissions_decorator_1.Permissions)('bookings:update'), (0, swagger_1.ApiOperation)({ summary: 'Annuler une réservation et obtenir un remboursement dans le Wallet' })];
        _transfer_decorators = [(0, common_1.Post)('transfer'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.DRIVER, database_1.UserRole.SUPER_ADMIN), (0, permissions_decorator_1.Permissions)('bookings:update'), (0, swagger_1.ApiOperation)({ summary: 'Transférer des passagers vers un autre trajet' })];
        _adminCancel_decorators = [(0, common_1.Post)(':id/admin-cancel'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN), (0, permissions_decorator_1.Permissions)('bookings:update'), (0, swagger_1.ApiOperation)({ summary: 'Annuler une réservation de force sans code (Admin)' })];
        _getById_decorators = [(0, common_1.Get)(':id'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN), (0, permissions_decorator_1.Permissions)('bookings:read'), (0, swagger_1.ApiOperation)({ summary: 'Voir le détail complet d\'une réservation (Admin)' })];
        __esDecorate(_classThis, null, _getAllBookings_decorators, { kind: "method", name: "getAllBookings", static: false, private: false, access: { has: function (obj) { return "getAllBookings" in obj; }, get: function (obj) { return obj.getAllBookings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyQr_decorators, { kind: "method", name: "verifyQr", static: false, private: false, access: { has: function (obj) { return "verifyQr" in obj; }, get: function (obj) { return obj.verifyQr; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStatus_decorators, { kind: "method", name: "getStatus", static: false, private: false, access: { has: function (obj) { return "getStatus" in obj; }, get: function (obj) { return obj.getStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyTickets_decorators, { kind: "method", name: "getMyTickets", static: false, private: false, access: { has: function (obj) { return "getMyTickets" in obj; }, get: function (obj) { return obj.getMyTickets; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _hideTickets_decorators, { kind: "method", name: "hideTickets", static: false, private: false, access: { has: function (obj) { return "hideTickets" in obj; }, get: function (obj) { return obj.hideTickets; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancelBooking_decorators, { kind: "method", name: "cancelBooking", static: false, private: false, access: { has: function (obj) { return "cancelBooking" in obj; }, get: function (obj) { return obj.cancelBooking; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _transfer_decorators, { kind: "method", name: "transfer", static: false, private: false, access: { has: function (obj) { return "transfer" in obj; }, get: function (obj) { return obj.transfer; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _adminCancel_decorators, { kind: "method", name: "adminCancel", static: false, private: false, access: { has: function (obj) { return "adminCancel" in obj; }, get: function (obj) { return obj.adminCancel; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getById_decorators, { kind: "method", name: "getById", static: false, private: false, access: { has: function (obj) { return "getById" in obj; }, get: function (obj) { return obj.getById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BookingsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BookingsController = _classThis;
}();
exports.BookingsController = BookingsController;
