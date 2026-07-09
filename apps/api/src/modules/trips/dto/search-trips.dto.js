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
exports.SearchTripsDto = void 0;
var class_validator_1 = require("class-validator");
var SearchTripsDto = function () {
    var _a;
    var _originCity_decorators;
    var _originCity_initializers = [];
    var _originCity_extraInitializers = [];
    var _destinationCity_decorators;
    var _destinationCity_initializers = [];
    var _destinationCity_extraInitializers = [];
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SearchTripsDto() {
                this.originCity = __runInitializers(this, _originCity_initializers, void 0);
                this.destinationCity = (__runInitializers(this, _originCity_extraInitializers), __runInitializers(this, _destinationCity_initializers, void 0));
                this.date = (__runInitializers(this, _destinationCity_extraInitializers), __runInitializers(this, _date_initializers, void 0));
                __runInitializers(this, _date_extraInitializers);
            }
            return SearchTripsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _originCity_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _destinationCity_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _date_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _originCity_decorators, { kind: "field", name: "originCity", static: false, private: false, access: { has: function (obj) { return "originCity" in obj; }, get: function (obj) { return obj.originCity; }, set: function (obj, value) { obj.originCity = value; } }, metadata: _metadata }, _originCity_initializers, _originCity_extraInitializers);
            __esDecorate(null, null, _destinationCity_decorators, { kind: "field", name: "destinationCity", static: false, private: false, access: { has: function (obj) { return "destinationCity" in obj; }, get: function (obj) { return obj.destinationCity; }, set: function (obj, value) { obj.destinationCity = value; } }, metadata: _metadata }, _destinationCity_initializers, _destinationCity_extraInitializers);
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SearchTripsDto = SearchTripsDto;
