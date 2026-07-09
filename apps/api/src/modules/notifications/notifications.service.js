"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.NotificationsService = void 0;
var common_1 = require("@nestjs/common");
var nodemailer = __importStar(require("nodemailer"));
var database_1 = require("@aller-retour/database");
var NotificationsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var NotificationsService = _classThis = /** @class */ (function () {
        function NotificationsService_1() {
            this.logger = new common_1.Logger(NotificationsService.name);
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER || 'allogoosn@gmail.com',
                    pass: process.env.EMAIL_PASS || 'votre-mot-de-passe-d-application'
                }
            });
        }
        NotificationsService_1.prototype.sendNotification = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var notification, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.notification.create({
                                data: {
                                    type: database_1.NotificationType.EMAIL,
                                    status: database_1.NotificationStatus.PENDING,
                                    title: params.subject,
                                    content: params.safeContent, // Store only the safe content
                                    recipientId: params.recipientId,
                                    bookingId: params.bookingId,
                                    tripId: params.tripId,
                                }
                            })];
                        case 1:
                            notification = _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, , 7]);
                            // 2. Attempt to send
                            return [4 /*yield*/, this.transporter.sendMail({
                                    from: process.env.EMAIL_USER || 'allogoosn@gmail.com',
                                    to: params.to,
                                    subject: params.subject,
                                    html: params.html
                                })];
                        case 3:
                            // 2. Attempt to send
                            _a.sent();
                            // 3. Success
                            return [4 /*yield*/, database_1.prisma.notification.update({
                                    where: { id: notification.id },
                                    data: {
                                        status: database_1.NotificationStatus.SENT,
                                        sentAt: new Date()
                                    }
                                })];
                        case 4:
                            // 3. Success
                            _a.sent();
                            this.logger.log("Email sent successfully to ".concat(params.to));
                            return [3 /*break*/, 7];
                        case 5:
                            error_1 = _a.sent();
                            // 4. Failure
                            this.logger.error("Failed to send email to ".concat(params.to, ": ").concat(error_1.message));
                            return [4 /*yield*/, database_1.prisma.notification.update({
                                    where: { id: notification.id },
                                    data: {
                                        status: database_1.NotificationStatus.FAILED,
                                        errorMessage: error_1.message || 'Erreur inconnue lors de l\'envoi'
                                    }
                                })];
                        case 6:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        NotificationsService_1.prototype.getNotifications = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, page, _b, limit, search, type, status, recipientId, bookingId, tripId, dateFrom, dateTo, skip, where, _c, items, total;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = filters.page, page = _a === void 0 ? 1 : _a, _b = filters.limit, limit = _b === void 0 ? 10 : _b, search = filters.search, type = filters.type, status = filters.status, recipientId = filters.recipientId, bookingId = filters.bookingId, tripId = filters.tripId, dateFrom = filters.dateFrom, dateTo = filters.dateTo;
                            skip = (page - 1) * limit;
                            where = {};
                            if (search) {
                                where.OR = [
                                    { title: { contains: search, mode: 'insensitive' } },
                                    { content: { contains: search, mode: 'insensitive' } },
                                    { recipient: { fullName: { contains: search, mode: 'insensitive' } } },
                                    { recipient: { email: { contains: search, mode: 'insensitive' } } }
                                ];
                            }
                            if (type)
                                where.type = type;
                            if (status)
                                where.status = status;
                            if (recipientId)
                                where.recipientId = recipientId;
                            if (bookingId)
                                where.bookingId = bookingId;
                            if (tripId)
                                where.tripId = tripId;
                            if (dateFrom || dateTo) {
                                where.createdAt = {};
                                if (dateFrom)
                                    where.createdAt.gte = new Date(dateFrom);
                                if (dateTo)
                                    where.createdAt.lte = new Date(dateTo);
                            }
                            return [4 /*yield*/, Promise.all([
                                    database_1.prisma.notification.findMany({
                                        where: where,
                                        include: {
                                            recipient: {
                                                select: { id: true, fullName: true, email: true, phone: true }
                                            },
                                            booking: {
                                                select: { id: true, status: true }
                                            },
                                            trip: {
                                                select: { id: true, departureTime: true }
                                            }
                                        },
                                        orderBy: { createdAt: 'desc' },
                                        skip: skip,
                                        take: limit,
                                    }),
                                    database_1.prisma.notification.count({ where: where })
                                ])];
                        case 1:
                            _c = _d.sent(), items = _c[0], total = _c[1];
                            return [2 /*return*/, {
                                    items: items,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit)
                                    }
                                }];
                    }
                });
            });
        };
        return NotificationsService_1;
    }());
    __setFunctionName(_classThis, "NotificationsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationsService = _classThis;
}();
exports.NotificationsService = NotificationsService;
