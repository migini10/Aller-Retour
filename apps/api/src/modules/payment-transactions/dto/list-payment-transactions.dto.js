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
exports.ListPaymentTransactionsDto = void 0;
var class_validator_1 = require("class-validator");
var ListPaymentTransactionsDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _method_decorators;
    var _method_initializers = [];
    var _method_extraInitializers = [];
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _bookingId_decorators;
    var _bookingId_initializers = [];
    var _bookingId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ListPaymentTransactionsDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.method = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _method_initializers, void 0));
                this.date = (__runInitializers(this, _method_extraInitializers), __runInitializers(this, _date_initializers, void 0));
                this.userId = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.bookingId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _bookingId_initializers, void 0));
                __runInitializers(this, _bookingId_extraInitializers);
            }
            return ListPaymentTransactionsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _method_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _date_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _userId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _bookingId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _method_decorators, { kind: "field", name: "method", static: false, private: false, access: { has: function (obj) { return "method" in obj; }, get: function (obj) { return obj.method; }, set: function (obj, value) { obj.method = value; } }, metadata: _metadata }, _method_initializers, _method_extraInitializers);
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _bookingId_decorators, { kind: "field", name: "bookingId", static: false, private: false, access: { has: function (obj) { return "bookingId" in obj; }, get: function (obj) { return obj.bookingId; }, set: function (obj, value) { obj.bookingId = value; } }, metadata: _metadata }, _bookingId_initializers, _bookingId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ListPaymentTransactionsDto = ListPaymentTransactionsDto;
