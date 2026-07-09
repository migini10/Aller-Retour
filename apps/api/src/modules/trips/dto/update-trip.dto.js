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
exports.UpdateTripDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var UpdateTripDto = function () {
    var _a;
    var _originCity_decorators;
    var _originCity_initializers = [];
    var _originCity_extraInitializers = [];
    var _destinationCity_decorators;
    var _destinationCity_initializers = [];
    var _destinationCity_extraInitializers = [];
    var _departureTime_decorators;
    var _departureTime_initializers = [];
    var _departureTime_extraInitializers = [];
    var _vehicleId_decorators;
    var _vehicleId_initializers = [];
    var _vehicleId_extraInitializers = [];
    var _pricePerSeat_decorators;
    var _pricePerSeat_initializers = [];
    var _pricePerSeat_extraInitializers = [];
    var _placesLibres_decorators;
    var _placesLibres_initializers = [];
    var _placesLibres_extraInitializers = [];
    var _passagers_decorators;
    var _passagers_initializers = [];
    var _passagers_extraInitializers = [];
    var _vehicleCapacity_decorators;
    var _vehicleCapacity_initializers = [];
    var _vehicleCapacity_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateTripDto() {
                this.originCity = __runInitializers(this, _originCity_initializers, void 0);
                this.destinationCity = (__runInitializers(this, _originCity_extraInitializers), __runInitializers(this, _destinationCity_initializers, void 0));
                this.departureTime = (__runInitializers(this, _destinationCity_extraInitializers), __runInitializers(this, _departureTime_initializers, void 0));
                this.vehicleId = (__runInitializers(this, _departureTime_extraInitializers), __runInitializers(this, _vehicleId_initializers, void 0));
                this.pricePerSeat = (__runInitializers(this, _vehicleId_extraInitializers), __runInitializers(this, _pricePerSeat_initializers, void 0));
                this.placesLibres = (__runInitializers(this, _pricePerSeat_extraInitializers), __runInitializers(this, _placesLibres_initializers, void 0));
                this.passagers = (__runInitializers(this, _placesLibres_extraInitializers), __runInitializers(this, _passagers_initializers, void 0));
                this.vehicleCapacity = (__runInitializers(this, _passagers_extraInitializers), __runInitializers(this, _vehicleCapacity_initializers, void 0));
                __runInitializers(this, _vehicleCapacity_extraInitializers);
            }
            return UpdateTripDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _originCity_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _destinationCity_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _departureTime_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _vehicleId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _pricePerSeat_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _placesLibres_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _passagers_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _vehicleCapacity_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _originCity_decorators, { kind: "field", name: "originCity", static: false, private: false, access: { has: function (obj) { return "originCity" in obj; }, get: function (obj) { return obj.originCity; }, set: function (obj, value) { obj.originCity = value; } }, metadata: _metadata }, _originCity_initializers, _originCity_extraInitializers);
            __esDecorate(null, null, _destinationCity_decorators, { kind: "field", name: "destinationCity", static: false, private: false, access: { has: function (obj) { return "destinationCity" in obj; }, get: function (obj) { return obj.destinationCity; }, set: function (obj, value) { obj.destinationCity = value; } }, metadata: _metadata }, _destinationCity_initializers, _destinationCity_extraInitializers);
            __esDecorate(null, null, _departureTime_decorators, { kind: "field", name: "departureTime", static: false, private: false, access: { has: function (obj) { return "departureTime" in obj; }, get: function (obj) { return obj.departureTime; }, set: function (obj, value) { obj.departureTime = value; } }, metadata: _metadata }, _departureTime_initializers, _departureTime_extraInitializers);
            __esDecorate(null, null, _vehicleId_decorators, { kind: "field", name: "vehicleId", static: false, private: false, access: { has: function (obj) { return "vehicleId" in obj; }, get: function (obj) { return obj.vehicleId; }, set: function (obj, value) { obj.vehicleId = value; } }, metadata: _metadata }, _vehicleId_initializers, _vehicleId_extraInitializers);
            __esDecorate(null, null, _pricePerSeat_decorators, { kind: "field", name: "pricePerSeat", static: false, private: false, access: { has: function (obj) { return "pricePerSeat" in obj; }, get: function (obj) { return obj.pricePerSeat; }, set: function (obj, value) { obj.pricePerSeat = value; } }, metadata: _metadata }, _pricePerSeat_initializers, _pricePerSeat_extraInitializers);
            __esDecorate(null, null, _placesLibres_decorators, { kind: "field", name: "placesLibres", static: false, private: false, access: { has: function (obj) { return "placesLibres" in obj; }, get: function (obj) { return obj.placesLibres; }, set: function (obj, value) { obj.placesLibres = value; } }, metadata: _metadata }, _placesLibres_initializers, _placesLibres_extraInitializers);
            __esDecorate(null, null, _passagers_decorators, { kind: "field", name: "passagers", static: false, private: false, access: { has: function (obj) { return "passagers" in obj; }, get: function (obj) { return obj.passagers; }, set: function (obj, value) { obj.passagers = value; } }, metadata: _metadata }, _passagers_initializers, _passagers_extraInitializers);
            __esDecorate(null, null, _vehicleCapacity_decorators, { kind: "field", name: "vehicleCapacity", static: false, private: false, access: { has: function (obj) { return "vehicleCapacity" in obj; }, get: function (obj) { return obj.vehicleCapacity; }, set: function (obj, value) { obj.vehicleCapacity = value; } }, metadata: _metadata }, _vehicleCapacity_initializers, _vehicleCapacity_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateTripDto = UpdateTripDto;
