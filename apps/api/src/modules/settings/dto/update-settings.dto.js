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
exports.UpdateSettingsDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var UpdateSettingsDto = function () {
    var _a;
    var _platformName_decorators;
    var _platformName_initializers = [];
    var _platformName_extraInitializers = [];
    var _supportEmail_decorators;
    var _supportEmail_initializers = [];
    var _supportEmail_extraInitializers = [];
    var _supportPhone_decorators;
    var _supportPhone_initializers = [];
    var _supportPhone_extraInitializers = [];
    var _defaultCurrency_decorators;
    var _defaultCurrency_initializers = [];
    var _defaultCurrency_extraInitializers = [];
    var _clientCommissionRate_decorators;
    var _clientCommissionRate_initializers = [];
    var _clientCommissionRate_extraInitializers = [];
    var _driverCommissionRate_decorators;
    var _driverCommissionRate_initializers = [];
    var _driverCommissionRate_extraInitializers = [];
    var _maintenanceMode_decorators;
    var _maintenanceMode_initializers = [];
    var _maintenanceMode_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateSettingsDto() {
                this.platformName = __runInitializers(this, _platformName_initializers, void 0);
                this.supportEmail = (__runInitializers(this, _platformName_extraInitializers), __runInitializers(this, _supportEmail_initializers, void 0));
                this.supportPhone = (__runInitializers(this, _supportEmail_extraInitializers), __runInitializers(this, _supportPhone_initializers, void 0));
                this.defaultCurrency = (__runInitializers(this, _supportPhone_extraInitializers), __runInitializers(this, _defaultCurrency_initializers, void 0));
                this.clientCommissionRate = (__runInitializers(this, _defaultCurrency_extraInitializers), __runInitializers(this, _clientCommissionRate_initializers, void 0));
                this.driverCommissionRate = (__runInitializers(this, _clientCommissionRate_extraInitializers), __runInitializers(this, _driverCommissionRate_initializers, void 0));
                this.maintenanceMode = (__runInitializers(this, _driverCommissionRate_extraInitializers), __runInitializers(this, _maintenanceMode_initializers, void 0));
                __runInitializers(this, _maintenanceMode_extraInitializers);
            }
            return UpdateSettingsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _platformName_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _supportEmail_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _supportPhone_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _defaultCurrency_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _clientCommissionRate_decorators = [(0, swagger_1.ApiPropertyOptional)({ minimum: 0, maximum: 20 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(20)];
            _driverCommissionRate_decorators = [(0, swagger_1.ApiPropertyOptional)({ minimum: 0, maximum: 20 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(20)];
            _maintenanceMode_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _platformName_decorators, { kind: "field", name: "platformName", static: false, private: false, access: { has: function (obj) { return "platformName" in obj; }, get: function (obj) { return obj.platformName; }, set: function (obj, value) { obj.platformName = value; } }, metadata: _metadata }, _platformName_initializers, _platformName_extraInitializers);
            __esDecorate(null, null, _supportEmail_decorators, { kind: "field", name: "supportEmail", static: false, private: false, access: { has: function (obj) { return "supportEmail" in obj; }, get: function (obj) { return obj.supportEmail; }, set: function (obj, value) { obj.supportEmail = value; } }, metadata: _metadata }, _supportEmail_initializers, _supportEmail_extraInitializers);
            __esDecorate(null, null, _supportPhone_decorators, { kind: "field", name: "supportPhone", static: false, private: false, access: { has: function (obj) { return "supportPhone" in obj; }, get: function (obj) { return obj.supportPhone; }, set: function (obj, value) { obj.supportPhone = value; } }, metadata: _metadata }, _supportPhone_initializers, _supportPhone_extraInitializers);
            __esDecorate(null, null, _defaultCurrency_decorators, { kind: "field", name: "defaultCurrency", static: false, private: false, access: { has: function (obj) { return "defaultCurrency" in obj; }, get: function (obj) { return obj.defaultCurrency; }, set: function (obj, value) { obj.defaultCurrency = value; } }, metadata: _metadata }, _defaultCurrency_initializers, _defaultCurrency_extraInitializers);
            __esDecorate(null, null, _clientCommissionRate_decorators, { kind: "field", name: "clientCommissionRate", static: false, private: false, access: { has: function (obj) { return "clientCommissionRate" in obj; }, get: function (obj) { return obj.clientCommissionRate; }, set: function (obj, value) { obj.clientCommissionRate = value; } }, metadata: _metadata }, _clientCommissionRate_initializers, _clientCommissionRate_extraInitializers);
            __esDecorate(null, null, _driverCommissionRate_decorators, { kind: "field", name: "driverCommissionRate", static: false, private: false, access: { has: function (obj) { return "driverCommissionRate" in obj; }, get: function (obj) { return obj.driverCommissionRate; }, set: function (obj, value) { obj.driverCommissionRate = value; } }, metadata: _metadata }, _driverCommissionRate_initializers, _driverCommissionRate_extraInitializers);
            __esDecorate(null, null, _maintenanceMode_decorators, { kind: "field", name: "maintenanceMode", static: false, private: false, access: { has: function (obj) { return "maintenanceMode" in obj; }, get: function (obj) { return obj.maintenanceMode; }, set: function (obj, value) { obj.maintenanceMode = value; } }, metadata: _metadata }, _maintenanceMode_initializers, _maintenanceMode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateSettingsDto = UpdateSettingsDto;
