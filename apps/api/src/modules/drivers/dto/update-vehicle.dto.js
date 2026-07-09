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
exports.UpdateVehicleDto = void 0;
var class_validator_1 = require("class-validator");
var client_1 = require("@prisma/client");
var UpdateVehicleDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _insuranceExpiry_decorators;
    var _insuranceExpiry_initializers = [];
    var _insuranceExpiry_extraInitializers = [];
    var _inspectionExpiry_decorators;
    var _inspectionExpiry_initializers = [];
    var _inspectionExpiry_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateVehicleDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.insuranceExpiry = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _insuranceExpiry_initializers, void 0));
                this.inspectionExpiry = (__runInitializers(this, _insuranceExpiry_extraInitializers), __runInitializers(this, _inspectionExpiry_initializers, void 0));
                __runInitializers(this, _inspectionExpiry_extraInitializers);
            }
            return UpdateVehicleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(client_1.VehicleStatus)];
            _insuranceExpiry_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _inspectionExpiry_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _insuranceExpiry_decorators, { kind: "field", name: "insuranceExpiry", static: false, private: false, access: { has: function (obj) { return "insuranceExpiry" in obj; }, get: function (obj) { return obj.insuranceExpiry; }, set: function (obj, value) { obj.insuranceExpiry = value; } }, metadata: _metadata }, _insuranceExpiry_initializers, _insuranceExpiry_extraInitializers);
            __esDecorate(null, null, _inspectionExpiry_decorators, { kind: "field", name: "inspectionExpiry", static: false, private: false, access: { has: function (obj) { return "inspectionExpiry" in obj; }, get: function (obj) { return obj.inspectionExpiry; }, set: function (obj, value) { obj.inspectionExpiry = value; } }, metadata: _metadata }, _inspectionExpiry_initializers, _inspectionExpiry_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateVehicleDto = UpdateVehicleDto;
