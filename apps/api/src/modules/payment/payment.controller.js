"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.PaymentController = void 0;
var common_1 = require("@nestjs/common");
var passport_1 = require("@nestjs/passport");
var rbac_guard_1 = require("../../core/rbac/rbac.guard");
var roles_decorator_1 = require("../../core/rbac/roles.decorator");
var database_1 = require("@aller-retour/database");
var PaymentController = function () {
    var _classDecorators = [(0, common_1.Controller)('payment')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _simulatePaymentInit_decorators;
    var _waveWebhook_decorators;
    var _orangeMoneyWebhook_decorators;
    var _simulateWaveWebhookTrigger_decorators;
    var _simulateOmWebhookTrigger_decorators;
    var PaymentController = _classThis = /** @class */ (function () {
        function PaymentController_1(paymentService) {
            this.paymentService = (__runInitializers(this, _instanceExtraInitializers), paymentService);
        }
        /**
         * Endpoint de test pour simuler le déclenchement d'un paiement côté client
         * Normalement appelé par le service de Réservation ou Wallet
         */
        PaymentController_1.prototype.simulatePaymentInit = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (body.provider === 'WAVE') {
                        return [2 /*return*/, this.paymentService.initiateWavePayment(body.phone, body.amount, body.reference)];
                    }
                    else {
                        return [2 /*return*/, this.paymentService.initiateOrangeMoneyPayment(body.phone, body.amount, body.reference)];
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * Webhook officiel de Wave (Sandbox & Prod)
         * TODO: Lors de l'intégration finale, ajouter une validation de la signature ou d'un secret provider
         */
        PaymentController_1.prototype.waveWebhook = function (payload, res) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.paymentService.handleWaveWebhook(payload)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, res.status(common_1.HttpStatus.OK).send()];
                    }
                });
            });
        };
        /**
         * Webhook officiel d'Orange Money (Sandbox & Prod)
         * TODO: Lors de l'intégration finale, ajouter une validation de la signature ou d'un secret provider
         */
        PaymentController_1.prototype.orangeMoneyWebhook = function (payload, res) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.paymentService.handleOrangeMoneyWebhook(payload)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, res.status(common_1.HttpStatus.OK).send()];
                    }
                });
            });
        };
        /**
         * UTILITAIRE SANDBOX SEULEMENT: Permet de déclencher un faux webhook pour simuler
         * qu'un utilisateur a tapé son code secret sur son téléphone.
         */
        PaymentController_1.prototype.simulateWaveWebhookTrigger = function (txId, ref) {
            return __awaiter(this, void 0, void 0, function () {
                var mockPayload;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockPayload = {
                                type: 'checkout.session.completed',
                                data: {
                                    id: txId,
                                    client_reference: ref,
                                    payment_status: 'succeeded'
                                }
                            };
                            return [4 /*yield*/, this.paymentService.handleWaveWebhook(mockPayload)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { success: true, message: 'Wave Webhook simulated successfully', mockPayload: mockPayload }];
                    }
                });
            });
        };
        PaymentController_1.prototype.simulateOmWebhookTrigger = function (txId, ref) {
            return __awaiter(this, void 0, void 0, function () {
                var mockPayload;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockPayload = {
                                status: 'SUCCESS',
                                notif_id: txId,
                                tx_reference: ref
                            };
                            return [4 /*yield*/, this.paymentService.handleOrangeMoneyWebhook(mockPayload)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { success: true, message: 'Orange Money Webhook simulated successfully', mockPayload: mockPayload }];
                    }
                });
            });
        };
        return PaymentController_1;
    }());
    __setFunctionName(_classThis, "PaymentController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _simulatePaymentInit_decorators = [(0, common_1.Post)('simulate-init'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN)];
        _waveWebhook_decorators = [(0, common_1.Post)('webhook/wave')];
        _orangeMoneyWebhook_decorators = [(0, common_1.Post)('webhook/om')];
        _simulateWaveWebhookTrigger_decorators = [(0, common_1.Get)('webhook/wave/simulate'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN)];
        _simulateOmWebhookTrigger_decorators = [(0, common_1.Get)('webhook/om/simulate'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN)];
        __esDecorate(_classThis, null, _simulatePaymentInit_decorators, { kind: "method", name: "simulatePaymentInit", static: false, private: false, access: { has: function (obj) { return "simulatePaymentInit" in obj; }, get: function (obj) { return obj.simulatePaymentInit; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _waveWebhook_decorators, { kind: "method", name: "waveWebhook", static: false, private: false, access: { has: function (obj) { return "waveWebhook" in obj; }, get: function (obj) { return obj.waveWebhook; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _orangeMoneyWebhook_decorators, { kind: "method", name: "orangeMoneyWebhook", static: false, private: false, access: { has: function (obj) { return "orangeMoneyWebhook" in obj; }, get: function (obj) { return obj.orangeMoneyWebhook; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _simulateWaveWebhookTrigger_decorators, { kind: "method", name: "simulateWaveWebhookTrigger", static: false, private: false, access: { has: function (obj) { return "simulateWaveWebhookTrigger" in obj; }, get: function (obj) { return obj.simulateWaveWebhookTrigger; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _simulateOmWebhookTrigger_decorators, { kind: "method", name: "simulateOmWebhookTrigger", static: false, private: false, access: { has: function (obj) { return "simulateOmWebhookTrigger" in obj; }, get: function (obj) { return obj.simulateOmWebhookTrigger; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentController = _classThis;
}();
exports.PaymentController = PaymentController;
