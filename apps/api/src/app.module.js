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
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var core_1 = require("@nestjs/core");
var app_controller_1 = require("./app.controller");
var maintenance_guard_1 = require("./core/maintenance/maintenance.guard");
var database_module_1 = require("./core/database/database.module");
var auth_module_1 = require("./modules/auth/auth.module");
var trips_module_1 = require("./modules/trips/trips.module");
var bookings_module_1 = require("./modules/bookings/bookings.module");
var payment_module_1 = require("./modules/payment/payment.module");
var pricing_module_1 = require("./modules/pricing/pricing.module");
var qr_module_1 = require("./modules/qr/qr.module");
var users_module_1 = require("./modules/users/users.module");
var drivers_module_1 = require("./modules/drivers/drivers.module");
var driver_earnings_module_1 = require("./modules/driver-earnings/driver-earnings.module");
var payment_transactions_module_1 = require("./modules/payment-transactions/payment-transactions.module");
var analytics_module_1 = require("./modules/analytics/analytics.module");
var reviews_module_1 = require("./modules/reviews/reviews.module");
var notifications_module_1 = require("./modules/notifications/notifications.module");
var settings_module_1 = require("./modules/settings/settings.module");
var monitoring_module_1 = require("./modules/monitoring/monitoring.module");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                }),
                database_module_1.DatabaseModule,
                auth_module_1.AuthModule,
                trips_module_1.TripsModule,
                bookings_module_1.BookingsModule,
                payment_module_1.PaymentModule,
                pricing_module_1.PricingModule,
                qr_module_1.QrModule,
                users_module_1.UsersModule,
                drivers_module_1.DriversModule,
                driver_earnings_module_1.DriverEarningsModule,
                payment_transactions_module_1.PaymentTransactionsModule,
                analytics_module_1.AnalyticsModule,
                reviews_module_1.ReviewsModule,
                notifications_module_1.NotificationsModule,
                settings_module_1.SettingsModule,
                monitoring_module_1.MonitoringModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [
                {
                    provide: core_1.APP_GUARD,
                    useClass: maintenance_guard_1.MaintenanceGuard,
                },
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
