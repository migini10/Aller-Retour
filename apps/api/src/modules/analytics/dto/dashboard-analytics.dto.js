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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardAnalyticsDto = exports.AlertDto = exports.TimelineEventDto = exports.CityActivityDto = exports.TopDriverDto = exports.TrendDto = exports.KpiDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var KpiDto = function () {
    var _a;
    var _totalUsers_decorators;
    var _totalUsers_initializers = [];
    var _totalUsers_extraInitializers = [];
    var _newUsersToday_decorators;
    var _newUsersToday_initializers = [];
    var _newUsersToday_extraInitializers = [];
    var _activeDrivers_decorators;
    var _activeDrivers_initializers = [];
    var _activeDrivers_extraInitializers = [];
    var _totalTrips_decorators;
    var _totalTrips_initializers = [];
    var _totalTrips_extraInitializers = [];
    var _tripsToday_decorators;
    var _tripsToday_initializers = [];
    var _tripsToday_extraInitializers = [];
    var _bookingsToday_decorators;
    var _bookingsToday_initializers = [];
    var _bookingsToday_extraInitializers = [];
    var _cancelledBookings_decorators;
    var _cancelledBookings_initializers = [];
    var _cancelledBookings_extraInitializers = [];
    var _successfulPayments_decorators;
    var _successfulPayments_initializers = [];
    var _successfulPayments_extraInitializers = [];
    var _failedPayments_decorators;
    var _failedPayments_initializers = [];
    var _failedPayments_extraInitializers = [];
    var _pendingPayments_decorators;
    var _pendingPayments_initializers = [];
    var _pendingPayments_extraInitializers = [];
    var _totalRevenue_decorators;
    var _totalRevenue_initializers = [];
    var _totalRevenue_extraInitializers = [];
    var _totalPlatformFees_decorators;
    var _totalPlatformFees_initializers = [];
    var _totalPlatformFees_extraInitializers = [];
    var _pendingDriverEarnings_decorators;
    var _pendingDriverEarnings_initializers = [];
    var _pendingDriverEarnings_extraInitializers = [];
    var _averageRating_decorators;
    var _averageRating_initializers = [];
    var _averageRating_extraInitializers = [];
    return _a = /** @class */ (function () {
            function KpiDto() {
                this.totalUsers = __runInitializers(this, _totalUsers_initializers, void 0);
                this.newUsersToday = (__runInitializers(this, _totalUsers_extraInitializers), __runInitializers(this, _newUsersToday_initializers, void 0));
                this.activeDrivers = (__runInitializers(this, _newUsersToday_extraInitializers), __runInitializers(this, _activeDrivers_initializers, void 0));
                this.totalTrips = (__runInitializers(this, _activeDrivers_extraInitializers), __runInitializers(this, _totalTrips_initializers, void 0));
                this.tripsToday = (__runInitializers(this, _totalTrips_extraInitializers), __runInitializers(this, _tripsToday_initializers, void 0));
                this.bookingsToday = (__runInitializers(this, _tripsToday_extraInitializers), __runInitializers(this, _bookingsToday_initializers, void 0));
                this.cancelledBookings = (__runInitializers(this, _bookingsToday_extraInitializers), __runInitializers(this, _cancelledBookings_initializers, void 0));
                this.successfulPayments = (__runInitializers(this, _cancelledBookings_extraInitializers), __runInitializers(this, _successfulPayments_initializers, void 0));
                this.failedPayments = (__runInitializers(this, _successfulPayments_extraInitializers), __runInitializers(this, _failedPayments_initializers, void 0));
                this.pendingPayments = (__runInitializers(this, _failedPayments_extraInitializers), __runInitializers(this, _pendingPayments_initializers, void 0));
                this.totalRevenue = (__runInitializers(this, _pendingPayments_extraInitializers), __runInitializers(this, _totalRevenue_initializers, void 0));
                this.totalPlatformFees = (__runInitializers(this, _totalRevenue_extraInitializers), __runInitializers(this, _totalPlatformFees_initializers, void 0));
                this.pendingDriverEarnings = (__runInitializers(this, _totalPlatformFees_extraInitializers), __runInitializers(this, _pendingDriverEarnings_initializers, void 0));
                this.averageRating = (__runInitializers(this, _pendingDriverEarnings_extraInitializers), __runInitializers(this, _averageRating_initializers, void 0));
                __runInitializers(this, _averageRating_extraInitializers);
            }
            return KpiDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _totalUsers_decorators = [(0, swagger_1.ApiProperty)()];
            _newUsersToday_decorators = [(0, swagger_1.ApiProperty)()];
            _activeDrivers_decorators = [(0, swagger_1.ApiProperty)()];
            _totalTrips_decorators = [(0, swagger_1.ApiProperty)()];
            _tripsToday_decorators = [(0, swagger_1.ApiProperty)()];
            _bookingsToday_decorators = [(0, swagger_1.ApiProperty)()];
            _cancelledBookings_decorators = [(0, swagger_1.ApiProperty)()];
            _successfulPayments_decorators = [(0, swagger_1.ApiProperty)()];
            _failedPayments_decorators = [(0, swagger_1.ApiProperty)()];
            _pendingPayments_decorators = [(0, swagger_1.ApiProperty)()];
            _totalRevenue_decorators = [(0, swagger_1.ApiProperty)()];
            _totalPlatformFees_decorators = [(0, swagger_1.ApiProperty)()];
            _pendingDriverEarnings_decorators = [(0, swagger_1.ApiProperty)()];
            _averageRating_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _totalUsers_decorators, { kind: "field", name: "totalUsers", static: false, private: false, access: { has: function (obj) { return "totalUsers" in obj; }, get: function (obj) { return obj.totalUsers; }, set: function (obj, value) { obj.totalUsers = value; } }, metadata: _metadata }, _totalUsers_initializers, _totalUsers_extraInitializers);
            __esDecorate(null, null, _newUsersToday_decorators, { kind: "field", name: "newUsersToday", static: false, private: false, access: { has: function (obj) { return "newUsersToday" in obj; }, get: function (obj) { return obj.newUsersToday; }, set: function (obj, value) { obj.newUsersToday = value; } }, metadata: _metadata }, _newUsersToday_initializers, _newUsersToday_extraInitializers);
            __esDecorate(null, null, _activeDrivers_decorators, { kind: "field", name: "activeDrivers", static: false, private: false, access: { has: function (obj) { return "activeDrivers" in obj; }, get: function (obj) { return obj.activeDrivers; }, set: function (obj, value) { obj.activeDrivers = value; } }, metadata: _metadata }, _activeDrivers_initializers, _activeDrivers_extraInitializers);
            __esDecorate(null, null, _totalTrips_decorators, { kind: "field", name: "totalTrips", static: false, private: false, access: { has: function (obj) { return "totalTrips" in obj; }, get: function (obj) { return obj.totalTrips; }, set: function (obj, value) { obj.totalTrips = value; } }, metadata: _metadata }, _totalTrips_initializers, _totalTrips_extraInitializers);
            __esDecorate(null, null, _tripsToday_decorators, { kind: "field", name: "tripsToday", static: false, private: false, access: { has: function (obj) { return "tripsToday" in obj; }, get: function (obj) { return obj.tripsToday; }, set: function (obj, value) { obj.tripsToday = value; } }, metadata: _metadata }, _tripsToday_initializers, _tripsToday_extraInitializers);
            __esDecorate(null, null, _bookingsToday_decorators, { kind: "field", name: "bookingsToday", static: false, private: false, access: { has: function (obj) { return "bookingsToday" in obj; }, get: function (obj) { return obj.bookingsToday; }, set: function (obj, value) { obj.bookingsToday = value; } }, metadata: _metadata }, _bookingsToday_initializers, _bookingsToday_extraInitializers);
            __esDecorate(null, null, _cancelledBookings_decorators, { kind: "field", name: "cancelledBookings", static: false, private: false, access: { has: function (obj) { return "cancelledBookings" in obj; }, get: function (obj) { return obj.cancelledBookings; }, set: function (obj, value) { obj.cancelledBookings = value; } }, metadata: _metadata }, _cancelledBookings_initializers, _cancelledBookings_extraInitializers);
            __esDecorate(null, null, _successfulPayments_decorators, { kind: "field", name: "successfulPayments", static: false, private: false, access: { has: function (obj) { return "successfulPayments" in obj; }, get: function (obj) { return obj.successfulPayments; }, set: function (obj, value) { obj.successfulPayments = value; } }, metadata: _metadata }, _successfulPayments_initializers, _successfulPayments_extraInitializers);
            __esDecorate(null, null, _failedPayments_decorators, { kind: "field", name: "failedPayments", static: false, private: false, access: { has: function (obj) { return "failedPayments" in obj; }, get: function (obj) { return obj.failedPayments; }, set: function (obj, value) { obj.failedPayments = value; } }, metadata: _metadata }, _failedPayments_initializers, _failedPayments_extraInitializers);
            __esDecorate(null, null, _pendingPayments_decorators, { kind: "field", name: "pendingPayments", static: false, private: false, access: { has: function (obj) { return "pendingPayments" in obj; }, get: function (obj) { return obj.pendingPayments; }, set: function (obj, value) { obj.pendingPayments = value; } }, metadata: _metadata }, _pendingPayments_initializers, _pendingPayments_extraInitializers);
            __esDecorate(null, null, _totalRevenue_decorators, { kind: "field", name: "totalRevenue", static: false, private: false, access: { has: function (obj) { return "totalRevenue" in obj; }, get: function (obj) { return obj.totalRevenue; }, set: function (obj, value) { obj.totalRevenue = value; } }, metadata: _metadata }, _totalRevenue_initializers, _totalRevenue_extraInitializers);
            __esDecorate(null, null, _totalPlatformFees_decorators, { kind: "field", name: "totalPlatformFees", static: false, private: false, access: { has: function (obj) { return "totalPlatformFees" in obj; }, get: function (obj) { return obj.totalPlatformFees; }, set: function (obj, value) { obj.totalPlatformFees = value; } }, metadata: _metadata }, _totalPlatformFees_initializers, _totalPlatformFees_extraInitializers);
            __esDecorate(null, null, _pendingDriverEarnings_decorators, { kind: "field", name: "pendingDriverEarnings", static: false, private: false, access: { has: function (obj) { return "pendingDriverEarnings" in obj; }, get: function (obj) { return obj.pendingDriverEarnings; }, set: function (obj, value) { obj.pendingDriverEarnings = value; } }, metadata: _metadata }, _pendingDriverEarnings_initializers, _pendingDriverEarnings_extraInitializers);
            __esDecorate(null, null, _averageRating_decorators, { kind: "field", name: "averageRating", static: false, private: false, access: { has: function (obj) { return "averageRating" in obj; }, get: function (obj) { return obj.averageRating; }, set: function (obj, value) { obj.averageRating = value; } }, metadata: _metadata }, _averageRating_initializers, _averageRating_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.KpiDto = KpiDto;
var TrendDto = function () {
    var _a;
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _bookings_decorators;
    var _bookings_initializers = [];
    var _bookings_extraInitializers = [];
    var _revenue_decorators;
    var _revenue_initializers = [];
    var _revenue_extraInitializers = [];
    var _platformFees_decorators;
    var _platformFees_initializers = [];
    var _platformFees_extraInitializers = [];
    return _a = /** @class */ (function () {
            function TrendDto() {
                this.date = __runInitializers(this, _date_initializers, void 0);
                this.bookings = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _bookings_initializers, void 0));
                this.revenue = (__runInitializers(this, _bookings_extraInitializers), __runInitializers(this, _revenue_initializers, void 0));
                this.platformFees = (__runInitializers(this, _revenue_extraInitializers), __runInitializers(this, _platformFees_initializers, void 0));
                __runInitializers(this, _platformFees_extraInitializers);
            }
            return TrendDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _date_decorators = [(0, swagger_1.ApiProperty)()];
            _bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _revenue_decorators = [(0, swagger_1.ApiProperty)()];
            _platformFees_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _bookings_decorators, { kind: "field", name: "bookings", static: false, private: false, access: { has: function (obj) { return "bookings" in obj; }, get: function (obj) { return obj.bookings; }, set: function (obj, value) { obj.bookings = value; } }, metadata: _metadata }, _bookings_initializers, _bookings_extraInitializers);
            __esDecorate(null, null, _revenue_decorators, { kind: "field", name: "revenue", static: false, private: false, access: { has: function (obj) { return "revenue" in obj; }, get: function (obj) { return obj.revenue; }, set: function (obj, value) { obj.revenue = value; } }, metadata: _metadata }, _revenue_initializers, _revenue_extraInitializers);
            __esDecorate(null, null, _platformFees_decorators, { kind: "field", name: "platformFees", static: false, private: false, access: { has: function (obj) { return "platformFees" in obj; }, get: function (obj) { return obj.platformFees; }, set: function (obj, value) { obj.platformFees = value; } }, metadata: _metadata }, _platformFees_initializers, _platformFees_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.TrendDto = TrendDto;
var TopDriverDto = function () {
    var _a;
    var _driverId_decorators;
    var _driverId_initializers = [];
    var _driverId_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _totalEarnings_decorators;
    var _totalEarnings_initializers = [];
    var _totalEarnings_extraInitializers = [];
    var _completedTrips_decorators;
    var _completedTrips_initializers = [];
    var _completedTrips_extraInitializers = [];
    var _rating_decorators;
    var _rating_initializers = [];
    var _rating_extraInitializers = [];
    return _a = /** @class */ (function () {
            function TopDriverDto() {
                this.driverId = __runInitializers(this, _driverId_initializers, void 0);
                this.name = (__runInitializers(this, _driverId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.totalEarnings = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _totalEarnings_initializers, void 0));
                this.completedTrips = (__runInitializers(this, _totalEarnings_extraInitializers), __runInitializers(this, _completedTrips_initializers, void 0));
                this.rating = (__runInitializers(this, _completedTrips_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
                __runInitializers(this, _rating_extraInitializers);
            }
            return TopDriverDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _driverId_decorators = [(0, swagger_1.ApiProperty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)()];
            _totalEarnings_decorators = [(0, swagger_1.ApiProperty)()];
            _completedTrips_decorators = [(0, swagger_1.ApiProperty)()];
            _rating_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _driverId_decorators, { kind: "field", name: "driverId", static: false, private: false, access: { has: function (obj) { return "driverId" in obj; }, get: function (obj) { return obj.driverId; }, set: function (obj, value) { obj.driverId = value; } }, metadata: _metadata }, _driverId_initializers, _driverId_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _totalEarnings_decorators, { kind: "field", name: "totalEarnings", static: false, private: false, access: { has: function (obj) { return "totalEarnings" in obj; }, get: function (obj) { return obj.totalEarnings; }, set: function (obj, value) { obj.totalEarnings = value; } }, metadata: _metadata }, _totalEarnings_initializers, _totalEarnings_extraInitializers);
            __esDecorate(null, null, _completedTrips_decorators, { kind: "field", name: "completedTrips", static: false, private: false, access: { has: function (obj) { return "completedTrips" in obj; }, get: function (obj) { return obj.completedTrips; }, set: function (obj, value) { obj.completedTrips = value; } }, metadata: _metadata }, _completedTrips_initializers, _completedTrips_extraInitializers);
            __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: function (obj) { return "rating" in obj; }, get: function (obj) { return obj.rating; }, set: function (obj, value) { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.TopDriverDto = TopDriverDto;
var CityActivityDto = function () {
    var _a;
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _bookings_decorators;
    var _bookings_initializers = [];
    var _bookings_extraInitializers = [];
    var _trips_decorators;
    var _trips_initializers = [];
    var _trips_extraInitializers = [];
    var _revenue_decorators;
    var _revenue_initializers = [];
    var _revenue_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CityActivityDto() {
                this.city = __runInitializers(this, _city_initializers, void 0);
                this.bookings = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _bookings_initializers, void 0));
                this.trips = (__runInitializers(this, _bookings_extraInitializers), __runInitializers(this, _trips_initializers, void 0));
                this.revenue = (__runInitializers(this, _trips_extraInitializers), __runInitializers(this, _revenue_initializers, void 0));
                __runInitializers(this, _revenue_extraInitializers);
            }
            return CityActivityDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _city_decorators = [(0, swagger_1.ApiProperty)()];
            _bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _trips_decorators = [(0, swagger_1.ApiProperty)()];
            _revenue_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _bookings_decorators, { kind: "field", name: "bookings", static: false, private: false, access: { has: function (obj) { return "bookings" in obj; }, get: function (obj) { return obj.bookings; }, set: function (obj, value) { obj.bookings = value; } }, metadata: _metadata }, _bookings_initializers, _bookings_extraInitializers);
            __esDecorate(null, null, _trips_decorators, { kind: "field", name: "trips", static: false, private: false, access: { has: function (obj) { return "trips" in obj; }, get: function (obj) { return obj.trips; }, set: function (obj, value) { obj.trips = value; } }, metadata: _metadata }, _trips_initializers, _trips_extraInitializers);
            __esDecorate(null, null, _revenue_decorators, { kind: "field", name: "revenue", static: false, private: false, access: { has: function (obj) { return "revenue" in obj; }, get: function (obj) { return obj.revenue; }, set: function (obj, value) { obj.revenue = value; } }, metadata: _metadata }, _revenue_initializers, _revenue_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CityActivityDto = CityActivityDto;
var TimelineEventDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function TimelineEventDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.type = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.title = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.createdAt = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                __runInitializers(this, _createdAt_extraInitializers);
            }
            return TimelineEventDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _type_decorators = [(0, swagger_1.ApiProperty)()];
            _title_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.TimelineEventDto = TimelineEventDto;
var AlertDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _message_decorators;
    var _message_initializers = [];
    var _message_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AlertDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.type = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.title = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.message = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _message_initializers, void 0));
                __runInitializers(this, _message_extraInitializers);
            }
            return AlertDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _type_decorators = [(0, swagger_1.ApiProperty)()];
            _title_decorators = [(0, swagger_1.ApiProperty)()];
            _message_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: function (obj) { return "message" in obj; }, get: function (obj) { return obj.message; }, set: function (obj, value) { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AlertDto = AlertDto;
var DashboardAnalyticsDto = function () {
    var _a;
    var _kpis_decorators;
    var _kpis_initializers = [];
    var _kpis_extraInitializers = [];
    var _trends_decorators;
    var _trends_initializers = [];
    var _trends_extraInitializers = [];
    var _topDrivers_decorators;
    var _topDrivers_initializers = [];
    var _topDrivers_extraInitializers = [];
    var _cityActivity_decorators;
    var _cityActivity_initializers = [];
    var _cityActivity_extraInitializers = [];
    var _timeline_decorators;
    var _timeline_initializers = [];
    var _timeline_extraInitializers = [];
    var _alerts_decorators;
    var _alerts_initializers = [];
    var _alerts_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DashboardAnalyticsDto() {
                this.kpis = __runInitializers(this, _kpis_initializers, void 0);
                this.trends = (__runInitializers(this, _kpis_extraInitializers), __runInitializers(this, _trends_initializers, void 0));
                this.topDrivers = (__runInitializers(this, _trends_extraInitializers), __runInitializers(this, _topDrivers_initializers, void 0));
                this.cityActivity = (__runInitializers(this, _topDrivers_extraInitializers), __runInitializers(this, _cityActivity_initializers, void 0));
                this.timeline = (__runInitializers(this, _cityActivity_extraInitializers), __runInitializers(this, _timeline_initializers, void 0));
                this.alerts = (__runInitializers(this, _timeline_extraInitializers), __runInitializers(this, _alerts_initializers, void 0));
                __runInitializers(this, _alerts_extraInitializers);
            }
            return DashboardAnalyticsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _kpis_decorators = [(0, swagger_1.ApiProperty)()];
            _trends_decorators = [(0, swagger_1.ApiProperty)({ type: [TrendDto] })];
            _topDrivers_decorators = [(0, swagger_1.ApiProperty)({ type: [TopDriverDto] })];
            _cityActivity_decorators = [(0, swagger_1.ApiProperty)({ type: [CityActivityDto] })];
            _timeline_decorators = [(0, swagger_1.ApiProperty)({ type: [TimelineEventDto] })];
            _alerts_decorators = [(0, swagger_1.ApiProperty)({ type: [AlertDto] })];
            __esDecorate(null, null, _kpis_decorators, { kind: "field", name: "kpis", static: false, private: false, access: { has: function (obj) { return "kpis" in obj; }, get: function (obj) { return obj.kpis; }, set: function (obj, value) { obj.kpis = value; } }, metadata: _metadata }, _kpis_initializers, _kpis_extraInitializers);
            __esDecorate(null, null, _trends_decorators, { kind: "field", name: "trends", static: false, private: false, access: { has: function (obj) { return "trends" in obj; }, get: function (obj) { return obj.trends; }, set: function (obj, value) { obj.trends = value; } }, metadata: _metadata }, _trends_initializers, _trends_extraInitializers);
            __esDecorate(null, null, _topDrivers_decorators, { kind: "field", name: "topDrivers", static: false, private: false, access: { has: function (obj) { return "topDrivers" in obj; }, get: function (obj) { return obj.topDrivers; }, set: function (obj, value) { obj.topDrivers = value; } }, metadata: _metadata }, _topDrivers_initializers, _topDrivers_extraInitializers);
            __esDecorate(null, null, _cityActivity_decorators, { kind: "field", name: "cityActivity", static: false, private: false, access: { has: function (obj) { return "cityActivity" in obj; }, get: function (obj) { return obj.cityActivity; }, set: function (obj, value) { obj.cityActivity = value; } }, metadata: _metadata }, _cityActivity_initializers, _cityActivity_extraInitializers);
            __esDecorate(null, null, _timeline_decorators, { kind: "field", name: "timeline", static: false, private: false, access: { has: function (obj) { return "timeline" in obj; }, get: function (obj) { return obj.timeline; }, set: function (obj, value) { obj.timeline = value; } }, metadata: _metadata }, _timeline_initializers, _timeline_extraInitializers);
            __esDecorate(null, null, _alerts_decorators, { kind: "field", name: "alerts", static: false, private: false, access: { has: function (obj) { return "alerts" in obj; }, get: function (obj) { return obj.alerts; }, set: function (obj, value) { obj.alerts = value; } }, metadata: _metadata }, _alerts_initializers, _alerts_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DashboardAnalyticsDto = DashboardAnalyticsDto;
