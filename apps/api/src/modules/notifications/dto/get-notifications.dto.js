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
exports.GetNotificationsDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var database_1 = require("@aller-retour/database");
var GetNotificationsDto = function () {
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
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _recipientId_decorators;
    var _recipientId_initializers = [];
    var _recipientId_extraInitializers = [];
    var _bookingId_decorators;
    var _bookingId_initializers = [];
    var _bookingId_extraInitializers = [];
    var _tripId_decorators;
    var _tripId_initializers = [];
    var _tripId_extraInitializers = [];
    var _dateFrom_decorators;
    var _dateFrom_initializers = [];
    var _dateFrom_extraInitializers = [];
    var _dateTo_decorators;
    var _dateTo_initializers = [];
    var _dateTo_extraInitializers = [];
    return _a = /** @class */ (function () {
            function GetNotificationsDto() {
                this.page = __runInitializers(this, _page_initializers, 1);
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 10));
                this.search = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                this.type = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.status = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.recipientId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _recipientId_initializers, void 0));
                this.bookingId = (__runInitializers(this, _recipientId_extraInitializers), __runInitializers(this, _bookingId_initializers, void 0));
                this.tripId = (__runInitializers(this, _bookingId_extraInitializers), __runInitializers(this, _tripId_initializers, void 0));
                this.dateFrom = (__runInitializers(this, _tripId_extraInitializers), __runInitializers(this, _dateFrom_initializers, void 0));
                this.dateTo = (__runInitializers(this, _dateFrom_extraInitializers), __runInitializers(this, _dateTo_initializers, void 0));
                __runInitializers(this, _dateTo_extraInitializers);
            }
            return GetNotificationsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _search_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _type_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: database_1.NotificationType }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(database_1.NotificationType)];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: database_1.NotificationStatus }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(database_1.NotificationStatus)];
            _recipientId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _bookingId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _tripId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _dateFrom_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _dateTo_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _recipientId_decorators, { kind: "field", name: "recipientId", static: false, private: false, access: { has: function (obj) { return "recipientId" in obj; }, get: function (obj) { return obj.recipientId; }, set: function (obj, value) { obj.recipientId = value; } }, metadata: _metadata }, _recipientId_initializers, _recipientId_extraInitializers);
            __esDecorate(null, null, _bookingId_decorators, { kind: "field", name: "bookingId", static: false, private: false, access: { has: function (obj) { return "bookingId" in obj; }, get: function (obj) { return obj.bookingId; }, set: function (obj, value) { obj.bookingId = value; } }, metadata: _metadata }, _bookingId_initializers, _bookingId_extraInitializers);
            __esDecorate(null, null, _tripId_decorators, { kind: "field", name: "tripId", static: false, private: false, access: { has: function (obj) { return "tripId" in obj; }, get: function (obj) { return obj.tripId; }, set: function (obj, value) { obj.tripId = value; } }, metadata: _metadata }, _tripId_initializers, _tripId_extraInitializers);
            __esDecorate(null, null, _dateFrom_decorators, { kind: "field", name: "dateFrom", static: false, private: false, access: { has: function (obj) { return "dateFrom" in obj; }, get: function (obj) { return obj.dateFrom; }, set: function (obj, value) { obj.dateFrom = value; } }, metadata: _metadata }, _dateFrom_initializers, _dateFrom_extraInitializers);
            __esDecorate(null, null, _dateTo_decorators, { kind: "field", name: "dateTo", static: false, private: false, access: { has: function (obj) { return "dateTo" in obj; }, get: function (obj) { return obj.dateTo; }, set: function (obj, value) { obj.dateTo = value; } }, metadata: _metadata }, _dateTo_initializers, _dateTo_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.GetNotificationsDto = GetNotificationsDto;
