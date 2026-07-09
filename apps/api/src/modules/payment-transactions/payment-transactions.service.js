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
exports.PaymentTransactionsService = void 0;
var common_1 = require("@nestjs/common");
var database_1 = require("@aller-retour/database");
var PaymentTransactionsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PaymentTransactionsService = _classThis = /** @class */ (function () {
        function PaymentTransactionsService_1() {
        }
        PaymentTransactionsService_1.prototype.findAll = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var where, startOfDay, endOfDay, transactions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = {};
                            if (dto.status)
                                where.status = dto.status;
                            if (dto.method)
                                where.method = dto.method;
                            if (dto.userId)
                                where.userId = dto.userId;
                            if (dto.bookingId)
                                where.bookingId = dto.bookingId;
                            if (dto.date) {
                                startOfDay = new Date(dto.date);
                                startOfDay.setUTCHours(0, 0, 0, 0);
                                endOfDay = new Date(startOfDay);
                                endOfDay.setDate(endOfDay.getDate() + 1);
                                where.createdAt = {
                                    gte: startOfDay,
                                    lt: endOfDay,
                                };
                            }
                            return [4 /*yield*/, database_1.prisma.paymentTransaction.findMany({
                                    where: where,
                                    include: {
                                        user: {
                                            select: { id: true, fullName: true, phone: true }
                                        },
                                        booking: {
                                            select: { id: true, seatNumber: true, tripId: true }
                                        }
                                    },
                                    orderBy: { createdAt: 'desc' },
                                    take: 100, // Simplification pagination
                                })];
                        case 1:
                            transactions = _a.sent();
                            return [2 /*return*/, transactions];
                    }
                });
            });
        };
        PaymentTransactionsService_1.prototype.getSummary = function () {
            return __awaiter(this, void 0, void 0, function () {
                var transactions, totalSuccessCount, totalFailedCount, totalPendingCount, totalAmountCollected, totalAmountFailed, _i, transactions_1, tx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.paymentTransaction.findMany({
                                select: {
                                    status: true,
                                    amount: true,
                                }
                            })];
                        case 1:
                            transactions = _a.sent();
                            totalSuccessCount = 0;
                            totalFailedCount = 0;
                            totalPendingCount = 0;
                            totalAmountCollected = 0;
                            totalAmountFailed = 0;
                            for (_i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
                                tx = transactions_1[_i];
                                if (tx.status === 'SUCCESS') {
                                    totalSuccessCount++;
                                    totalAmountCollected += tx.amount;
                                }
                                else if (tx.status === 'FAILED') {
                                    totalFailedCount++;
                                    totalAmountFailed += tx.amount;
                                }
                                else if (tx.status === 'PENDING') {
                                    totalPendingCount++;
                                }
                            }
                            return [2 /*return*/, {
                                    totalSuccess: totalSuccessCount,
                                    totalFailed: totalFailedCount,
                                    totalPending: totalPendingCount,
                                    totalCollectedAmount: totalAmountCollected,
                                    totalFailedAmount: totalAmountFailed
                                }];
                    }
                });
            });
        };
        PaymentTransactionsService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.paymentTransaction.findUnique({
                                where: { id: id },
                                include: {
                                    user: { select: { id: true, fullName: true, phone: true } },
                                    booking: true,
                                }
                            })];
                        case 1:
                            transaction = _a.sent();
                            if (!transaction) {
                                throw new common_1.NotFoundException('Transaction introuvable');
                            }
                            return [2 /*return*/, transaction];
                    }
                });
            });
        };
        return PaymentTransactionsService_1;
    }());
    __setFunctionName(_classThis, "PaymentTransactionsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentTransactionsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentTransactionsService = _classThis;
}();
exports.PaymentTransactionsService = PaymentTransactionsService;
