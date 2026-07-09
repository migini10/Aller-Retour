"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.AnalyticsService = void 0;
var common_1 = require("@nestjs/common");
var database_1 = require("@aller-retour/database");
var AnalyticsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AnalyticsService = _classThis = /** @class */ (function () {
        function AnalyticsService_1() {
        }
        AnalyticsService_1.prototype.getDashboardAnalytics = function () {
            return __awaiter(this, void 0, void 0, function () {
                var today, endOfToday, thirtyDaysAgo, _a, totalUsers, newUsersToday, activeDrivers, totalTrips, tripsToday, bookingsToday, cancelledBookings, paymentSummary, earningSummary, ratingSummary, successfulPayments, failedPayments, pendingPayments, totalRevenue, _i, paymentSummary_1, p, pendingDriverEarnings, totalPlatformFees, _b, earningSummary_1, e, bookingsTrendRaw, revenueTrendRaw, feesTrendRaw, trendsMap, i, d, dateStr, _c, bookingsTrendRaw_1, row, dateStr, _d, revenueTrendRaw_1, row, dateStr, _e, feesTrendRaw_1, row, dateStr, trends, topEarnings, topDrivers, driverIds, users, userMap, _f, topEarnings_1, earning, user, cityActivityRaw, cityTripsRaw, tripMap, cityActivity, timeline, recentUsers, _g, recentUsers_1, u, recentBookings, _h, recentBookings_1, b, origin_1, dest, recentPayments, _j, recentPayments_1, p, recentTrips, _k, recentTrips_1, t, origin_2, dest, topTimeline, alerts, recentFailedPayments, oldPendingEarnings, pendingKyc;
                var _l, _m, _o, _p;
                return __generator(this, function (_q) {
                    switch (_q.label) {
                        case 0:
                            today = new Date();
                            today.setUTCHours(0, 0, 0, 0);
                            endOfToday = new Date(today);
                            endOfToday.setUTCHours(23, 59, 59, 999);
                            thirtyDaysAgo = new Date(today);
                            thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
                            return [4 /*yield*/, Promise.all([
                                    database_1.prisma.user.count(),
                                    database_1.prisma.user.count({ where: { createdAt: { gte: today, lte: endOfToday } } }),
                                    database_1.prisma.driverProfile.count({ where: { kycStatus: 'VERIFIED' } }),
                                    database_1.prisma.trip.count(),
                                    database_1.prisma.trip.count({ where: { departureTime: { gte: today, lte: endOfToday } } }),
                                    database_1.prisma.booking.count({ where: { createdAt: { gte: today, lte: endOfToday } } }),
                                    database_1.prisma.booking.count({ where: { status: 'CANCELLED' } }),
                                    database_1.prisma.paymentTransaction.groupBy({
                                        by: ['status'],
                                        _count: { id: true },
                                        _sum: { amount: true },
                                    }),
                                    database_1.prisma.driverEarning.groupBy({
                                        by: ['status'],
                                        _sum: { driverCut: true, platformCommission: true },
                                    }),
                                    database_1.prisma.driverProfile.aggregate({ _avg: { rating: true } })
                                ])];
                        case 1:
                            _a = _q.sent(), totalUsers = _a[0], newUsersToday = _a[1], activeDrivers = _a[2], totalTrips = _a[3], tripsToday = _a[4], bookingsToday = _a[5], cancelledBookings = _a[6], paymentSummary = _a[7], earningSummary = _a[8], ratingSummary = _a[9];
                            successfulPayments = 0;
                            failedPayments = 0;
                            pendingPayments = 0;
                            totalRevenue = 0;
                            for (_i = 0, paymentSummary_1 = paymentSummary; _i < paymentSummary_1.length; _i++) {
                                p = paymentSummary_1[_i];
                                if (p.status === 'SUCCESS') {
                                    successfulPayments = p._count.id;
                                    totalRevenue = p._sum.amount || 0;
                                }
                                else if (p.status === 'FAILED') {
                                    failedPayments = p._count.id;
                                }
                                else if (p.status === 'PENDING') {
                                    pendingPayments = p._count.id;
                                }
                            }
                            pendingDriverEarnings = 0;
                            totalPlatformFees = 0;
                            for (_b = 0, earningSummary_1 = earningSummary; _b < earningSummary_1.length; _b++) {
                                e = earningSummary_1[_b];
                                if (e.status === 'PENDING') {
                                    pendingDriverEarnings += e._sum.driverCut || 0;
                                }
                                totalPlatformFees += e._sum.platformCommission || 0;
                            }
                            return [4 /*yield*/, database_1.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT DATE_TRUNC('day', \"createdAt\") as date, count(id)::int as count\n      FROM bookings\n      WHERE \"createdAt\" >= ", "\n      GROUP BY DATE_TRUNC('day', \"createdAt\")\n    "], ["\n      SELECT DATE_TRUNC('day', \"createdAt\") as date, count(id)::int as count\n      FROM bookings\n      WHERE \"createdAt\" >= ", "\n      GROUP BY DATE_TRUNC('day', \"createdAt\")\n    "])), thirtyDaysAgo)];
                        case 2:
                            bookingsTrendRaw = _q.sent();
                            return [4 /*yield*/, database_1.prisma.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      SELECT DATE_TRUNC('day', \"createdAt\") as date, SUM(amount) as total\n      FROM payment_transactions\n      WHERE \"createdAt\" >= ", " AND status = 'SUCCESS'\n      GROUP BY DATE_TRUNC('day', \"createdAt\")\n    "], ["\n      SELECT DATE_TRUNC('day', \"createdAt\") as date, SUM(amount) as total\n      FROM payment_transactions\n      WHERE \"createdAt\" >= ", " AND status = 'SUCCESS'\n      GROUP BY DATE_TRUNC('day', \"createdAt\")\n    "])), thirtyDaysAgo)];
                        case 3:
                            revenueTrendRaw = _q.sent();
                            return [4 /*yield*/, database_1.prisma.$queryRaw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      SELECT DATE_TRUNC('day', \"createdAt\") as date, SUM(\"platformCommission\") as total\n      FROM driver_earnings\n      WHERE \"createdAt\" >= ", "\n      GROUP BY DATE_TRUNC('day', \"createdAt\")\n    "], ["\n      SELECT DATE_TRUNC('day', \"createdAt\") as date, SUM(\"platformCommission\") as total\n      FROM driver_earnings\n      WHERE \"createdAt\" >= ", "\n      GROUP BY DATE_TRUNC('day', \"createdAt\")\n    "])), thirtyDaysAgo)];
                        case 4:
                            feesTrendRaw = _q.sent();
                            trendsMap = new Map();
                            for (i = 0; i <= 30; i++) {
                                d = new Date(thirtyDaysAgo);
                                d.setUTCDate(d.getUTCDate() + i);
                                dateStr = d.toISOString().split('T')[0];
                                trendsMap.set(dateStr, { date: dateStr, bookings: 0, revenue: 0, platformFees: 0 });
                            }
                            for (_c = 0, bookingsTrendRaw_1 = bookingsTrendRaw; _c < bookingsTrendRaw_1.length; _c++) {
                                row = bookingsTrendRaw_1[_c];
                                dateStr = new Date(row.date).toISOString().split('T')[0];
                                if (trendsMap.has(dateStr))
                                    trendsMap.get(dateStr).bookings = row.count;
                            }
                            for (_d = 0, revenueTrendRaw_1 = revenueTrendRaw; _d < revenueTrendRaw_1.length; _d++) {
                                row = revenueTrendRaw_1[_d];
                                dateStr = new Date(row.date).toISOString().split('T')[0];
                                if (trendsMap.has(dateStr))
                                    trendsMap.get(dateStr).revenue = row.total || 0;
                            }
                            for (_e = 0, feesTrendRaw_1 = feesTrendRaw; _e < feesTrendRaw_1.length; _e++) {
                                row = feesTrendRaw_1[_e];
                                dateStr = new Date(row.date).toISOString().split('T')[0];
                                if (trendsMap.has(dateStr))
                                    trendsMap.get(dateStr).platformFees = row.total || 0;
                            }
                            trends = Array.from(trendsMap.values()).sort(function (a, b) { return a.date.localeCompare(b.date); });
                            return [4 /*yield*/, database_1.prisma.driverEarning.groupBy({
                                    by: ['driverId'],
                                    _sum: { driverCut: true },
                                    orderBy: { _sum: { driverCut: 'desc' } },
                                    take: 5,
                                })];
                        case 5:
                            topEarnings = _q.sent();
                            topDrivers = [];
                            if (!(topEarnings.length > 0)) return [3 /*break*/, 7];
                            driverIds = topEarnings.map(function (e) { return e.driverId; });
                            return [4 /*yield*/, database_1.prisma.user.findMany({
                                    where: { id: { in: driverIds } },
                                    include: { driverProfile: true },
                                })];
                        case 6:
                            users = _q.sent();
                            userMap = new Map(users.map(function (u) { return [u.id, u]; }));
                            for (_f = 0, topEarnings_1 = topEarnings; _f < topEarnings_1.length; _f++) {
                                earning = topEarnings_1[_f];
                                user = userMap.get(earning.driverId);
                                if (user) {
                                    topDrivers.push({
                                        driverId: user.id,
                                        name: user.fullName,
                                        totalEarnings: earning._sum.driverCut || 0,
                                        completedTrips: ((_l = user.driverProfile) === null || _l === void 0 ? void 0 : _l.totalTrips) || 0,
                                        rating: ((_m = user.driverProfile) === null || _m === void 0 ? void 0 : _m.rating) || 0,
                                    });
                                }
                            }
                            _q.label = 7;
                        case 7: return [4 /*yield*/, database_1.prisma.$queryRaw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      SELECT \n        s.city as city,\n        COUNT(b.id)::int as bookings,\n        SUM(b.\"amountPaid\") as revenue\n      FROM bookings b\n      JOIN trips t ON b.\"tripId\" = t.id\n      JOIN routes r ON t.\"routeId\" = r.id\n      JOIN stations s ON r.\"originStationId\" = s.id\n      WHERE b.status != 'CANCELLED'\n      GROUP BY s.city\n      ORDER BY bookings DESC\n      LIMIT 10\n    "], ["\n      SELECT \n        s.city as city,\n        COUNT(b.id)::int as bookings,\n        SUM(b.\"amountPaid\") as revenue\n      FROM bookings b\n      JOIN trips t ON b.\"tripId\" = t.id\n      JOIN routes r ON t.\"routeId\" = r.id\n      JOIN stations s ON r.\"originStationId\" = s.id\n      WHERE b.status != 'CANCELLED'\n      GROUP BY s.city\n      ORDER BY bookings DESC\n      LIMIT 10\n    "])))];
                        case 8:
                            cityActivityRaw = _q.sent();
                            return [4 /*yield*/, database_1.prisma.$queryRaw(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      SELECT \n        s.city as city,\n        COUNT(t.id)::int as trips\n      FROM trips t\n      JOIN routes r ON t.\"routeId\" = r.id\n      JOIN stations s ON r.\"originStationId\" = s.id\n      GROUP BY s.city\n    "], ["\n      SELECT \n        s.city as city,\n        COUNT(t.id)::int as trips\n      FROM trips t\n      JOIN routes r ON t.\"routeId\" = r.id\n      JOIN stations s ON r.\"originStationId\" = s.id\n      GROUP BY s.city\n    "])))];
                        case 9:
                            cityTripsRaw = _q.sent();
                            tripMap = new Map(cityTripsRaw.map(function (t) { return [t.city, t.trips]; }));
                            cityActivity = cityActivityRaw.map(function (row) { return ({
                                city: row.city,
                                bookings: row.bookings || 0,
                                revenue: row.revenue || 0,
                                trips: tripMap.get(row.city) || 0,
                            }); });
                            timeline = [];
                            return [4 /*yield*/, database_1.prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })];
                        case 10:
                            recentUsers = _q.sent();
                            for (_g = 0, recentUsers_1 = recentUsers; _g < recentUsers_1.length; _g++) {
                                u = recentUsers_1[_g];
                                timeline.push({ id: "user_".concat(u.id), type: 'DriverRegistered', title: 'Nouvel Utilisateur', description: "".concat(u.fullName, " s'est inscrit."), createdAt: u.createdAt });
                            }
                            return [4 /*yield*/, database_1.prisma.booking.findMany({ include: { trip: { include: { route: { include: { originStation: true, destinationStation: true } } } }, user: true }, orderBy: { createdAt: 'desc' }, take: 5 })];
                        case 11:
                            recentBookings = _q.sent();
                            for (_h = 0, recentBookings_1 = recentBookings; _h < recentBookings_1.length; _h++) {
                                b = recentBookings_1[_h];
                                origin_1 = b.trip.route.originStation.city;
                                dest = b.trip.route.destinationStation.city;
                                timeline.push({ id: "booking_".concat(b.id), type: 'BookingCreated', title: 'Nouvelle réservation', description: "".concat(b.user.fullName, " a r\u00E9serv\u00E9 ").concat(origin_1, " - ").concat(dest), createdAt: b.createdAt });
                            }
                            return [4 /*yield*/, database_1.prisma.paymentTransaction.findMany({ include: { booking: { include: { trip: true } } }, orderBy: { createdAt: 'desc' }, take: 5 })];
                        case 12:
                            recentPayments = _q.sent();
                            for (_j = 0, recentPayments_1 = recentPayments; _j < recentPayments_1.length; _j++) {
                                p = recentPayments_1[_j];
                                if (p.status === 'SUCCESS') {
                                    timeline.push({ id: "pay_".concat(p.id), type: 'PaymentSuccess', title: 'Paiement réussi', description: "".concat(p.method, " : ").concat(p.amount, " FCFA re\u00E7u"), createdAt: p.createdAt });
                                }
                            }
                            return [4 /*yield*/, database_1.prisma.trip.findMany({ include: { driver: { include: { user: true } }, route: { include: { originStation: true, destinationStation: true } } }, orderBy: { createdAt: 'desc' }, take: 5 })];
                        case 13:
                            recentTrips = _q.sent();
                            for (_k = 0, recentTrips_1 = recentTrips; _k < recentTrips_1.length; _k++) {
                                t = recentTrips_1[_k];
                                origin_2 = t.route.originStation.city;
                                dest = t.route.destinationStation.city;
                                timeline.push({ id: "trip_".concat(t.id), type: 'TripPublished', title: 'Trajet publié', description: "".concat(((_p = (_o = t.driver) === null || _o === void 0 ? void 0 : _o.user) === null || _p === void 0 ? void 0 : _p.fullName) || 'Chauffeur', " a publi\u00E9 ").concat(origin_2, " - ").concat(dest), createdAt: t.createdAt });
                            }
                            timeline.sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); });
                            topTimeline = timeline.slice(0, 20);
                            alerts = [];
                            return [4 /*yield*/, database_1.prisma.paymentTransaction.count({
                                    where: { status: 'FAILED', createdAt: { gte: new Date(Date.now() - 12 * 60 * 60 * 1000) } } // last 12 hours
                                })];
                        case 14:
                            recentFailedPayments = _q.sent();
                            if (recentFailedPayments > 0) {
                                alerts.push({ id: 'alert_failed_payments', type: 'error', title: 'Paiements échoués', message: "".concat(recentFailedPayments, " transactions ont \u00E9chou\u00E9 lors des derni\u00E8res 12 heures.") });
                            }
                            return [4 /*yield*/, database_1.prisma.driverEarning.count({
                                    where: { status: 'PENDING', createdAt: { lte: new Date(Date.now() - 48 * 60 * 60 * 1000) } } // older than 48 hours
                                })];
                        case 15:
                            oldPendingEarnings = _q.sent();
                            if (oldPendingEarnings > 0) {
                                alerts.push({ id: 'alert_pending_earnings', type: 'warning', title: 'Gains en attente', message: "".concat(oldPendingEarnings, " revenus chauffeurs sont en attente depuis plus de 48 heures.") });
                            }
                            return [4 /*yield*/, database_1.prisma.driverProfile.count({
                                    where: { kycStatus: 'PENDING' }
                                })];
                        case 16:
                            pendingKyc = _q.sent();
                            if (pendingKyc > 0) {
                                alerts.push({ id: 'alert_pending_kyc', type: 'info', title: 'KYC en attente', message: "".concat(pendingKyc, " profils chauffeurs attendent une validation KYC.") });
                            }
                            return [2 /*return*/, {
                                    kpis: {
                                        totalUsers: totalUsers,
                                        newUsersToday: newUsersToday,
                                        activeDrivers: activeDrivers,
                                        totalTrips: totalTrips,
                                        tripsToday: tripsToday,
                                        bookingsToday: bookingsToday,
                                        cancelledBookings: cancelledBookings,
                                        successfulPayments: successfulPayments,
                                        failedPayments: failedPayments,
                                        pendingPayments: pendingPayments,
                                        totalRevenue: totalRevenue,
                                        totalPlatformFees: totalPlatformFees,
                                        pendingDriverEarnings: pendingDriverEarnings,
                                        averageRating: ratingSummary._avg.rating || 0,
                                    },
                                    trends: trends,
                                    topDrivers: topDrivers,
                                    cityActivity: cityActivity,
                                    timeline: topTimeline,
                                    alerts: alerts,
                                }];
                    }
                });
            });
        };
        return AnalyticsService_1;
    }());
    __setFunctionName(_classThis, "AnalyticsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnalyticsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnalyticsService = _classThis;
}();
exports.AnalyticsService = AnalyticsService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
