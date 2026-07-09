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
exports.ReviewsService = void 0;
var common_1 = require("@nestjs/common");
var database_1 = require("@aller-retour/database");
var ReviewsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ReviewsService = _classThis = /** @class */ (function () {
        function ReviewsService_1() {
        }
        ReviewsService_1.prototype.findAll = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, page, _b, limit, search, rating, status, authorId, receiverId, bookingId, dateFrom, dateTo, skip, where, _c, total, data;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 20 : _b, search = query.search, rating = query.rating, status = query.status, authorId = query.authorId, receiverId = query.receiverId, bookingId = query.bookingId, dateFrom = query.dateFrom, dateTo = query.dateTo;
                            skip = (page - 1) * limit;
                            where = {};
                            if (search) {
                                where.OR = [
                                    { comment: { contains: search, mode: 'insensitive' } },
                                    { author: { fullName: { contains: search, mode: 'insensitive' } } },
                                    { receiver: { fullName: { contains: search, mode: 'insensitive' } } },
                                ];
                            }
                            if (rating)
                                where.rating = rating;
                            if (status)
                                where.status = status;
                            if (authorId)
                                where.authorId = authorId;
                            if (receiverId)
                                where.receiverId = receiverId;
                            if (bookingId)
                                where.bookingId = bookingId;
                            if (dateFrom || dateTo) {
                                where.createdAt = {};
                                if (dateFrom)
                                    where.createdAt.gte = new Date(dateFrom);
                                if (dateTo)
                                    where.createdAt.lte = new Date(dateTo);
                            }
                            return [4 /*yield*/, Promise.all([
                                    database_1.prisma.review.count({ where: where }),
                                    database_1.prisma.review.findMany({
                                        where: where,
                                        skip: skip,
                                        take: limit,
                                        orderBy: { createdAt: 'desc' },
                                        include: {
                                            author: { select: { id: true, fullName: true, avatarUrl: true, email: true, phone: true } },
                                            receiver: { select: { id: true, fullName: true, avatarUrl: true, email: true, phone: true } },
                                        },
                                    }),
                                ])];
                        case 1:
                            _c = _d.sent(), total = _c[0], data = _c[1];
                            return [2 /*return*/, {
                                    data: data,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        ReviewsService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var review;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.review.findUnique({
                                where: { id: id },
                                include: {
                                    author: { select: { id: true, fullName: true, avatarUrl: true, email: true, phone: true } },
                                    receiver: { select: { id: true, fullName: true, avatarUrl: true, email: true, phone: true } },
                                    booking: {
                                        include: {
                                            trip: {
                                                include: {
                                                    driver: {
                                                        include: {
                                                            user: { select: { id: true, fullName: true, avatarUrl: true, phone: true } },
                                                        },
                                                    },
                                                    vehicle: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            review = _a.sent();
                            if (!review) {
                                throw new common_1.NotFoundException('Avis introuvable');
                            }
                            return [2 /*return*/, review];
                    }
                });
            });
        };
        ReviewsService_1.prototype.updateStatus = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var review;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.review.findUnique({ where: { id: id } })];
                        case 1:
                            review = _a.sent();
                            if (!review) {
                                throw new common_1.NotFoundException('Avis introuvable');
                            }
                            return [2 /*return*/, database_1.prisma.review.update({
                                    where: { id: id },
                                    data: { status: dto.status },
                                    include: {
                                        author: { select: { id: true, fullName: true, avatarUrl: true } },
                                        receiver: { select: { id: true, fullName: true, avatarUrl: true } },
                                    },
                                })];
                    }
                });
            });
        };
        return ReviewsService_1;
    }());
    __setFunctionName(_classThis, "ReviewsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReviewsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReviewsService = _classThis;
}();
exports.ReviewsService = ReviewsService;
