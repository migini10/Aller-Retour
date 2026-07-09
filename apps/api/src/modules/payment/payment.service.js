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
exports.PaymentService = void 0;
var common_1 = require("@nestjs/common");
var uuid_1 = require("uuid");
var database_1 = require("@aller-retour/database");
var PaymentService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PaymentService = _classThis = /** @class */ (function () {
        function PaymentService_1(pricingService) {
            this.pricingService = pricingService;
            this.logger = new common_1.Logger(PaymentService.name);
        }
        /**
         * Simule un appel à l'API Wave Business pour déclencher un Push USSD
         */
        PaymentService_1.prototype.initiateWavePayment = function (phone, amount, reference) {
            return __awaiter(this, void 0, void 0, function () {
                var mockTransactionId, mockPaymentUrl, booking;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Initiating WAVE payment for ".concat(phone, " - Amount: ").concat(amount, " XOF"));
                            mockTransactionId = "wav_tx_".concat((0, uuid_1.v4)().replace(/-/g, '').substring(0, 16));
                            mockPaymentUrl = "https://pay.wave.com/checkout/".concat(mockTransactionId);
                            return [4 /*yield*/, database_1.prisma.booking.findUnique({ where: { id: reference } })];
                        case 1:
                            booking = _a.sent();
                            if (!booking) return [3 /*break*/, 3];
                            return [4 /*yield*/, database_1.prisma.paymentTransaction.create({
                                    data: {
                                        bookingId: reference,
                                        userId: booking.userId,
                                        amount: amount,
                                        method: 'WAVE',
                                        status: 'PENDING',
                                        providerRef: mockTransactionId,
                                    }
                                })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    transactionId: mockTransactionId,
                                    status: 'pending_validation',
                                    message: 'Push USSD envoyé au client sur son compte Wave.',
                                    provider: 'WAVE',
                                    paymentUrl: mockPaymentUrl,
                                    bookingId: reference,
                                    webhook_simulation_url: "/api/payment/webhook/wave/simulate?tx_id=".concat(mockTransactionId, "&ref=").concat(reference)
                                }];
                    }
                });
            });
        };
        /**
         * Simule un appel à l'API Orange Money Web Payment
         */
        PaymentService_1.prototype.initiateOrangeMoneyPayment = function (phone, amount, reference) {
            return __awaiter(this, void 0, void 0, function () {
                var mockTransactionId, mockPayToken, mockPaymentUrl, booking;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Initiating ORANGE MONEY payment for ".concat(phone, " - Amount: ").concat(amount, " XOF"));
                            mockTransactionId = "om_tx_".concat((0, uuid_1.v4)().replace(/-/g, '').substring(0, 16));
                            mockPayToken = "mp_token_".concat((0, uuid_1.v4)().substring(0, 8));
                            mockPaymentUrl = "https://api.orange.com/webpayment/pay/".concat(mockPayToken);
                            return [4 /*yield*/, database_1.prisma.booking.findUnique({ where: { id: reference } })];
                        case 1:
                            booking = _a.sent();
                            if (!booking) return [3 /*break*/, 3];
                            return [4 /*yield*/, database_1.prisma.paymentTransaction.create({
                                    data: {
                                        bookingId: reference,
                                        userId: booking.userId,
                                        amount: amount,
                                        method: 'ORANGE_MONEY',
                                        status: 'PENDING',
                                        providerRef: mockTransactionId,
                                    }
                                })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    transactionId: mockTransactionId,
                                    payToken: mockPayToken,
                                    status: 'pending_validation',
                                    message: 'Push USSD envoyé au client via Orange Money.',
                                    provider: 'ORANGE_MONEY',
                                    paymentUrl: mockPaymentUrl,
                                    bookingId: reference,
                                    webhook_simulation_url: "/api/payment/webhook/om/simulate?tx_id=".concat(mockTransactionId, "&ref=").concat(reference)
                                }];
                    }
                });
            });
        };
        /**
         * Processus d'un webhook Wave (Réel ou Simulé)
         */
        PaymentService_1.prototype.handleWaveWebhook = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var reference, txId;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            this.logger.log("Received Wave Webhook: ".concat(JSON.stringify(payload)));
                            reference = (_a = payload.data) === null || _a === void 0 ? void 0 : _a.client_reference;
                            txId = (_b = payload.data) === null || _b === void 0 ? void 0 : _b.id;
                            if (!reference || !txId) {
                                return [2 /*return*/, { success: false, message: 'Invalid payload' }];
                            }
                            if (!(payload.type === 'checkout.session.failed')) return [3 /*break*/, 2];
                            return [4 /*yield*/, database_1.prisma.paymentTransaction.updateMany({
                                    where: { method: 'WAVE', providerRef: txId, status: 'PENDING' },
                                    data: { status: 'FAILED', providerMessage: (_c = payload.data) === null || _c === void 0 ? void 0 : _c.payment_status, rawPayload: payload }
                                })];
                        case 1:
                            _d.sent();
                            return [2 /*return*/, { success: true, message: 'Payment marked as failed' }];
                        case 2: return [2 /*return*/, this.confirmBookingPayment(reference, txId, 'WAVE', payload)];
                    }
                });
            });
        };
        /**
         * Processus d'un webhook Orange Money (Réel ou Simulé)
         */
        PaymentService_1.prototype.handleOrangeMoneyWebhook = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var reference, txId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Received Orange Money Webhook: ".concat(JSON.stringify(payload)));
                            reference = payload.tx_reference;
                            txId = payload.notif_id;
                            if (!reference || !txId) {
                                return [2 /*return*/, { success: false, message: 'Invalid payload' }];
                            }
                            if (!(payload.status === 'FAILED')) return [3 /*break*/, 2];
                            return [4 /*yield*/, database_1.prisma.paymentTransaction.updateMany({
                                    where: { method: 'ORANGE_MONEY', providerRef: txId, status: 'PENDING' },
                                    data: { status: 'FAILED', providerMessage: payload.message, rawPayload: payload }
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { success: true, message: 'Payment marked as failed' }];
                        case 2: return [2 /*return*/, this.confirmBookingPayment(reference, txId, 'ORANGE_MONEY', payload)];
                    }
                });
            });
        };
        /**
         * Idempotent payment confirmation that marks booking as PAID/CONFIRMED and logs driver earnings
         */
        PaymentService_1.prototype.confirmBookingPayment = function (bookingId, paymentRef, method, rawPayload) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, pricing, updatedTxCount, e_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.booking.findUnique({
                                where: { id: bookingId },
                                include: {
                                    trip: {
                                        include: {
                                            driver: true,
                                            vehicle: {
                                                include: { owner: true }
                                            }
                                        }
                                    }
                                }
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking) {
                                return [2 /*return*/, { success: false, message: 'Booking not found' }];
                            }
                            return [4 /*yield*/, this.pricingService.calculatePricing(booking.basePrice)];
                        case 2:
                            pricing = _a.sent();
                            updatedTxCount = 0;
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, database_1.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var result;
                                    var _a, _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0: return [4 /*yield*/, tx.paymentTransaction.updateMany({
                                                    where: { method: method, providerRef: paymentRef, status: 'PENDING' },
                                                    data: {
                                                        status: 'SUCCESS',
                                                        providerMessage: 'Paiement validé',
                                                        rawPayload: rawPayload || null
                                                    }
                                                })];
                                            case 1:
                                                result = _c.sent();
                                                updatedTxCount = result.count;
                                                if (updatedTxCount === 0) {
                                                    // Si 0 ligne modifiée, un autre webhook a déjà gagné la course ou la tx n'est pas PENDING
                                                    return [2 /*return*/];
                                                }
                                                // Si nous avons gagné, on met à jour la réservation
                                                return [4 /*yield*/, tx.booking.update({
                                                        where: { id: bookingId },
                                                        data: {
                                                            status: 'CONFIRMED',
                                                            paymentRef: paymentRef,
                                                        }
                                                    })];
                                            case 2:
                                                // Si nous avons gagné, on met à jour la réservation
                                                _c.sent();
                                                // Et on crée le gain chauffeur
                                                return [4 /*yield*/, tx.driverEarning.create({
                                                        data: {
                                                            bookingId: bookingId,
                                                            driverId: ((_b = (_a = booking.trip.vehicle) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.userId) || booking.trip.driver.userId,
                                                            basePrice: pricing.basePrice,
                                                            driverCut: pricing.driverCut,
                                                            platformCommission: pricing.platformCommission,
                                                            status: 'PENDING',
                                                        }
                                                    })];
                                            case 3:
                                                // Et on crée le gain chauffeur
                                                _c.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            e_1 = _a.sent();
                            this.logger.error("Erreur lors de la transaction webhook pour ".concat(paymentRef, ":"), e_1);
                            return [2 /*return*/, { success: false, message: 'Erreur interne lors du traitement' }];
                        case 6:
                            if (updatedTxCount === 0) {
                                return [2 /*return*/, { success: true, message: 'Payment already processed or not pending' }];
                            }
                            return [2 /*return*/, { success: true, message: 'Booking confirmed and driver earnings registered' }];
                    }
                });
            });
        };
        return PaymentService_1;
    }());
    __setFunctionName(_classThis, "PaymentService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentService = _classThis;
}();
exports.PaymentService = PaymentService;
