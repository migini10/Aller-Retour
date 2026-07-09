"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.MonitoringService = void 0;
var common_1 = require("@nestjs/common");
var database_1 = require("@aller-retour/database");
var MonitoringService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MonitoringService = _classThis = /** @class */ (function () {
        function MonitoringService_1() {
            this.logger = new common_1.Logger(MonitoringService.name);
        }
        // Masquage PII
        MonitoringService_1.prototype.maskEmail = function (email) {
            if (!email || !email.includes('@'))
                return '***';
            var _a = email.split('@'), name = _a[0], domain = _a[1];
            if (name.length <= 1)
                return "*@".concat(domain);
            return "".concat(name[0], "***@").concat(domain);
        };
        // Formatage de l'uptime
        MonitoringService_1.prototype.formatUptime = function (seconds) {
            var d = Math.floor(seconds / (3600 * 24));
            var h = Math.floor((seconds % (3600 * 24)) / 3600);
            var m = Math.floor((seconds % 3600) / 60);
            var s = Math.floor(seconds % 60);
            var parts = [];
            if (d > 0)
                parts.push("".concat(d, "d"));
            if (h > 0)
                parts.push("".concat(h, "h"));
            if (m > 0)
                parts.push("".concat(m, "m"));
            parts.push("".concat(s, "s"));
            return parts.join(' ');
        };
        MonitoringService_1.prototype.getHealth = function () {
            return __awaiter(this, void 0, void 0, function () {
                var dbStatus, result, error_1, uptimeSeconds, memory;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dbStatus = 'OFFLINE';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, database_1.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT 1"], ["SELECT 1"])))];
                        case 2:
                            result = _a.sent();
                            if (result) {
                                dbStatus = 'ONLINE';
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.error('DB Health check failed', error_1);
                            return [3 /*break*/, 4];
                        case 4:
                            uptimeSeconds = process.uptime();
                            memory = process.memoryUsage();
                            return [2 /*return*/, {
                                    apiStatus: 'ONLINE',
                                    dbStatus: dbStatus,
                                    uptimeSeconds: uptimeSeconds,
                                    uptimeFormatted: this.formatUptime(uptimeSeconds),
                                    memoryUsedMb: Math.round(memory.heapUsed / 1024 / 1024 * 100) / 100,
                                    memoryTotalMb: Math.round(memory.heapTotal / 1024 / 1024 * 100) / 100,
                                    version: '1.0.0', // Devrait être lu depuis le package.json ou process.env
                                    environment: process.env.NODE_ENV || 'development',
                                    checkedAt: new Date().toISOString()
                                }];
                    }
                });
            });
        };
        MonitoringService_1.prototype.getAlerts = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sevenDaysAgo, failedPayments, failedNotifications, pendingEarningsCount, oldestPendingEarnings, failedPaymentsCount, failedNotificationsCount, items;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sevenDaysAgo = new Date();
                            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                            return [4 /*yield*/, database_1.prisma.paymentTransaction.findMany({
                                    where: {
                                        status: 'FAILED',
                                        createdAt: { gte: sevenDaysAgo }
                                    },
                                    orderBy: { createdAt: 'desc' },
                                    take: 10,
                                })];
                        case 1:
                            failedPayments = _a.sent();
                            failedNotifications = [];
                            return [4 /*yield*/, database_1.prisma.driverEarning.count({
                                    where: { status: 'PENDING' }
                                })];
                        case 2:
                            pendingEarningsCount = _a.sent();
                            return [4 /*yield*/, database_1.prisma.driverEarning.findMany({
                                    where: { status: 'PENDING' },
                                    orderBy: { createdAt: 'asc' }, // Les plus vieux en premier
                                    take: 5,
                                })];
                        case 3:
                            oldestPendingEarnings = _a.sent();
                            return [4 /*yield*/, database_1.prisma.paymentTransaction.count({
                                    where: {
                                        status: 'FAILED',
                                        createdAt: { gte: sevenDaysAgo }
                                    }
                                })];
                        case 4:
                            failedPaymentsCount = _a.sent();
                            failedNotificationsCount = 0;
                            items = [];
                            failedPayments.forEach(function (p) {
                                items.push({
                                    type: 'PAYMENT_FAILED',
                                    severity: 'HIGH',
                                    message: "Paiement ".concat(p.method, " \u00E9chou\u00E9 (").concat(p.amount, " FCFA)"),
                                    reference: p.id,
                                    occurredAt: p.createdAt
                                });
                            });
                            failedNotifications.forEach(function (n) {
                                var _a;
                                // Masquer l'email du destinataire s'il existe
                                var recipientMasked = ((_a = n.recipient) === null || _a === void 0 ? void 0 : _a.email) ? _this.maskEmail(n.recipient.email) : 'Inconnu';
                                items.push({
                                    type: 'NOTIFICATION_FAILED',
                                    severity: 'MEDIUM',
                                    message: "\u00C9chec notification (".concat(n.type, ") \u00E0 ").concat(recipientMasked, ". Erreur: ").concat(n.errorMessage || 'N/A'),
                                    reference: n.id,
                                    occurredAt: n.createdAt
                                });
                            });
                            oldestPendingEarnings.forEach(function (e) {
                                items.push({
                                    type: 'EARNING_PENDING',
                                    severity: 'LOW',
                                    message: "Gain de ".concat(e.driverCut, " FCFA en attente de paiement depuis longtemps"),
                                    reference: e.id,
                                    occurredAt: e.createdAt
                                });
                            });
                            // Trier les items par date (les plus récents en premier)
                            items.sort(function (a, b) { return b.occurredAt.getTime() - a.occurredAt.getTime(); });
                            return [2 /*return*/, {
                                    summary: {
                                        failedPayments7d: failedPaymentsCount,
                                        failedNotifications7d: failedNotificationsCount,
                                        pendingDriverEarnings: pendingEarningsCount,
                                    },
                                    items: items.slice(0, 20) // Limiter à 20
                                }];
                    }
                });
            });
        };
        return MonitoringService_1;
    }());
    __setFunctionName(_classThis, "MonitoringService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MonitoringService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MonitoringService = _classThis;
}();
exports.MonitoringService = MonitoringService;
var templateObject_1;
