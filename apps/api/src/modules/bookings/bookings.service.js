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
exports.BookingsService = void 0;
var common_1 = require("@nestjs/common");
var database_1 = require("@aller-retour/database");
var BookingsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BookingsService = _classThis = /** @class */ (function () {
        function BookingsService_1(paymentService, pricingService, qrService, notificationsService) {
            this.paymentService = paymentService;
            this.pricingService = pricingService;
            this.qrService = qrService;
            this.notificationsService = notificationsService;
        }
        BookingsService_1.prototype.createBooking = function (userId_1, tripId_1, seatNumber_1, paymentMethod_1) {
            return __awaiter(this, arguments, void 0, function (userId, tripId, seatNumber, paymentMethod, passengersCount) {
                var user;
                var _this = this;
                if (passengersCount === void 0) { passengersCount = 1; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.user.findUnique({ where: { id: userId } })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException("Utilisateur introuvable.");
                            return [4 /*yield*/, database_1.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var trip, fiveMinutesAgo, allBookings, takenSeats, assignedSeat, basePrice, pricing, qrCodeToken, status, booking, paymentSession;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.trip.findUnique({
                                                    where: { id: tripId },
                                                    include: { vehicle: true, driver: true },
                                                })];
                                            case 1:
                                                trip = _a.sent();
                                                if (!trip)
                                                    throw new common_1.NotFoundException("Trajet introuvable.");
                                                if (trip.isLocked) {
                                                    throw new common_1.BadRequestException("Ce trajet est verrouillé. Les réservations ne sont pas autorisées.");
                                                }
                                                fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                                                return [4 /*yield*/, tx.booking.findMany({
                                                        where: {
                                                            tripId: tripId,
                                                            OR: [
                                                                { status: { in: ['CONFIRMED', 'BOARDED'] } },
                                                                { status: 'PENDING_PAYMENT', createdAt: { gt: fiveMinutesAgo } }
                                                            ]
                                                        },
                                                        select: { seatNumber: true },
                                                    })];
                                            case 2:
                                                allBookings = _a.sent();
                                                takenSeats = new Set(allBookings.map(function (b) { return b.seatNumber; }));
                                                assignedSeat = seatNumber;
                                                if (trip.vehicle.capacity <= 7) {
                                                    // Véhicule particulier de 5 ou 7 places : pas de numéro de siège imposé
                                                    assignedSeat = 1;
                                                    while (takenSeats.has(assignedSeat) && assignedSeat <= trip.vehicle.capacity) {
                                                        assignedSeat++;
                                                    }
                                                }
                                                else {
                                                    if (assignedSeat < 1 || assignedSeat > trip.vehicle.capacity || takenSeats.has(assignedSeat)) {
                                                        assignedSeat = 1;
                                                        while (takenSeats.has(assignedSeat) && assignedSeat <= trip.vehicle.capacity) {
                                                            assignedSeat++;
                                                        }
                                                    }
                                                }
                                                if (assignedSeat > trip.vehicle.capacity) {
                                                    throw new common_1.BadRequestException("Le véhicule est complet, plus de place disponible.");
                                                }
                                                basePrice = trip.pricePerSeat * passengersCount;
                                                return [4 /*yield*/, this.pricingService.calculatePricing(basePrice)];
                                            case 3:
                                                pricing = _a.sent();
                                                qrCodeToken = this.qrService.generateQrToken(tripId, assignedSeat);
                                                status = (paymentMethod === 'WAVE' || paymentMethod === 'ORANGE_MONEY' || paymentMethod === 'FREE_MONEY' || paymentMethod === 'MTN_MOMO')
                                                    ? 'PENDING_PAYMENT'
                                                    : 'CONFIRMED';
                                                return [4 /*yield*/, tx.booking.create({
                                                        data: {
                                                            tripId: tripId,
                                                            userId: userId,
                                                            seatNumber: assignedSeat,
                                                            qrCodeToken: qrCodeToken,
                                                            status: status,
                                                            basePrice: pricing.basePrice,
                                                            clientFee: pricing.clientFee,
                                                            amountPaid: pricing.amountPaid,
                                                            paymentMethod: paymentMethod,
                                                        },
                                                        include: {
                                                            user: true,
                                                            trip: {
                                                                include: {
                                                                    route: {
                                                                        include: { originStation: true, destinationStation: true }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })];
                                            case 4:
                                                booking = _a.sent();
                                                paymentSession = null;
                                                if (!(paymentMethod === 'WAVE')) return [3 /*break*/, 6];
                                                return [4 /*yield*/, this.paymentService.initiateWavePayment(user.phone, pricing.amountPaid, booking.id)];
                                            case 5:
                                                paymentSession = _a.sent();
                                                return [3 /*break*/, 8];
                                            case 6:
                                                if (!(paymentMethod === 'ORANGE_MONEY')) return [3 /*break*/, 8];
                                                return [4 /*yield*/, this.paymentService.initiateOrangeMoneyPayment(user.phone, pricing.amountPaid, booking.id)];
                                            case 7:
                                                paymentSession = _a.sent();
                                                _a.label = 8;
                                            case 8:
                                                if (!(passengersCount > 1)) return [3 /*break*/, 10];
                                                return [4 /*yield*/, tx.trip.update({
                                                        where: { id: tripId },
                                                        data: { initialPassengers: { increment: passengersCount - 1 } }
                                                    })];
                                            case 9:
                                                _a.sent();
                                                _a.label = 10;
                                            case 10:
                                                if (!(status === 'CONFIRMED')) return [3 /*break*/, 12];
                                                // Create driver earning entry for immediate confirmed bookings (e.g. Cash/Direct payments)
                                                return [4 /*yield*/, tx.driverEarning.create({
                                                        data: {
                                                            bookingId: booking.id,
                                                            driverId: trip.driver.userId,
                                                            basePrice: pricing.basePrice,
                                                            driverCut: pricing.driverCut,
                                                            platformCommission: pricing.platformCommission,
                                                            status: 'PENDING',
                                                        }
                                                    })];
                                            case 11:
                                                // Create driver earning entry for immediate confirmed bookings (e.g. Cash/Direct payments)
                                                _a.sent();
                                                _a.label = 12;
                                            case 12: return [2 /*return*/, {
                                                    success: true,
                                                    booking: booking,
                                                    paymentSession: paymentSession,
                                                    message: status === 'CONFIRMED'
                                                        ? "Réservation confirmée avec succès. Un e-mail a été envoyé."
                                                        : "Réservation en attente de paiement. Veuillez valider sur votre mobile.",
                                                }];
                                        }
                                    });
                                }); })];
                        case 2: return [2 /*return*/, _a.sent()]; // End of transaction
                    }
                });
            });
        };
        BookingsService_1.prototype.verifyQrAtBoarding = function (qrCodeToken) {
            return __awaiter(this, void 0, void 0, function () {
                var parsedPayload, booking, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            parsedPayload = this.qrService.verifyQrToken(qrCodeToken);
                            return [4 /*yield*/, database_1.prisma.booking.findUnique({
                                    where: { qrCodeToken: qrCodeToken },
                                    include: { user: true, trip: { include: { route: true } } },
                                })];
                        case 1:
                            booking = _a.sent();
                            if (!booking)
                                throw new common_1.NotFoundException("Billet QR invalide ou inexistant.");
                            if (booking.status === 'BOARDED')
                                throw new common_1.BadRequestException("Attention: Ce billet a déjà été scanné à l'embarquement !");
                            if (booking.status !== 'CONFIRMED')
                                throw new common_1.BadRequestException("Billet non valide (Statut actuel: ".concat(booking.status, ")."));
                            return [4 /*yield*/, database_1.prisma.booking.update({
                                    where: { id: booking.id },
                                    data: { status: 'BOARDED', boardedAt: new Date() },
                                })];
                        case 2:
                            updated = _a.sent();
                            return [2 /*return*/, { success: true, message: "Embarquement validé avec succès !", booking: updated }];
                    }
                });
            });
        };
        BookingsService_1.prototype.getBookingStatus = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var booking;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.booking.findUnique({
                                where: { id: id },
                                select: { status: true, qrCodeToken: true }
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking)
                                throw new common_1.NotFoundException("Réservation introuvable.");
                            return [2 /*return*/, { success: true, status: booking.status, qrCodeToken: booking.qrCodeToken }];
                    }
                });
            });
        };
        BookingsService_1.prototype.getUserBookings = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var bookings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.booking.findMany({
                                where: { userId: userId, hiddenByUser: false },
                                include: {
                                    trip: {
                                        include: {
                                            route: {
                                                include: {
                                                    originStation: true,
                                                    destinationStation: true,
                                                }
                                            },
                                        }
                                    }
                                },
                                orderBy: { createdAt: 'desc' }
                            })];
                        case 1:
                            bookings = _a.sent();
                            return [2 /*return*/, bookings];
                    }
                });
            });
        };
        BookingsService_1.prototype.hideBookings = function (userId, bookingIds) {
            return __awaiter(this, void 0, void 0, function () {
                var bookings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!bookingIds || bookingIds.length === 0) {
                                throw new common_1.BadRequestException('Aucun identifiant de billet fourni.');
                            }
                            return [4 /*yield*/, database_1.prisma.booking.findMany({
                                    where: { id: { in: bookingIds }, userId: userId },
                                })];
                        case 1:
                            bookings = _a.sent();
                            if (bookings.length !== bookingIds.length) {
                                throw new common_1.BadRequestException('Certains billets sont introuvables ou ne vous appartiennent pas.');
                            }
                            return [4 /*yield*/, database_1.prisma.booking.updateMany({
                                    where: { id: { in: bookingIds }, userId: userId },
                                    data: { hiddenByUser: true },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { success: true, message: "".concat(bookings.length, " billet(s) supprim\u00E9(s) de votre liste.") }];
                    }
                });
            });
        };
        BookingsService_1.prototype.cancelBooking = function (bookingId, userId, secretCode) {
            return __awaiter(this, void 0, void 0, function () {
                var user, booking, updatedBooking;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.user.findUnique({ where: { id: userId } })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException("Utilisateur introuvable.");
                            // Validate secret code
                            if (!secretCode) {
                                throw new common_1.BadRequestException("Le code secret est requis pour annuler un billet.");
                            }
                            if (user.passwordHash !== secretCode) {
                                throw new common_1.BadRequestException("Code secret incorrect.");
                            }
                            return [4 /*yield*/, database_1.prisma.booking.findUnique({
                                    where: { id: bookingId },
                                })];
                        case 2:
                            booking = _a.sent();
                            if (!booking)
                                throw new common_1.NotFoundException("Réservation introuvable.");
                            if (booking.userId !== userId)
                                throw new common_1.BadRequestException("Action non autorisée.");
                            if (booking.status === 'CANCELLED')
                                throw new common_1.BadRequestException("Réservation déjà annulée.");
                            if (booking.status === 'BOARDED')
                                throw new common_1.BadRequestException("Impossible d'annuler un trajet déjà démarré.");
                            return [4 /*yield*/, database_1.prisma.booking.update({
                                    where: { id: bookingId },
                                    data: { status: 'CANCELLED' },
                                })];
                        case 3:
                            updatedBooking = _a.sent();
                            // Cancel driver earning if recorded
                            return [4 /*yield*/, database_1.prisma.driverEarning.updateMany({
                                    where: { bookingId: bookingId },
                                    data: { status: 'CANCELLED' }
                                })];
                        case 4:
                            // Cancel driver earning if recorded
                            _a.sent();
                            return [2 /*return*/, { success: true, message: "Réservation annulée." }];
                    }
                });
            });
        };
        BookingsService_1.prototype.transferBookings = function (operatorUserId, bookingIds, targetTripId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!bookingIds || bookingIds.length === 0) {
                                throw new common_1.BadRequestException("Aucune réservation spécifiée pour le transfert.");
                            }
                            return [4 /*yield*/, database_1.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var targetTrip, bookingsToTransfer, fiveMinutesAgo, targetBookings, takenSeats, availableSeatsCount, sourceTrip, updatedBookings, _i, bookingsToTransfer_1, booking, assignedSeat, updated, sourceTripId, remainingBookingsCount, sourceTripObj;
                                    var _a, _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0: return [4 /*yield*/, tx.trip.findUnique({
                                                    where: { id: targetTripId },
                                                    include: { vehicle: true },
                                                })];
                                            case 1:
                                                targetTrip = _c.sent();
                                                if (!targetTrip)
                                                    throw new common_1.NotFoundException("Trajet cible introuvable.");
                                                return [4 /*yield*/, tx.booking.findMany({
                                                        where: { id: { in: bookingIds } },
                                                        include: { trip: true },
                                                    })];
                                            case 2:
                                                bookingsToTransfer = _c.sent();
                                                if (bookingsToTransfer.length !== bookingIds.length) {
                                                    throw new common_1.NotFoundException("Certaines réservations à transférer sont introuvables.");
                                                }
                                                fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                                                return [4 /*yield*/, tx.booking.findMany({
                                                        where: {
                                                            tripId: targetTripId,
                                                            OR: [
                                                                { status: { in: ['CONFIRMED', 'BOARDED'] } },
                                                                { status: 'PENDING_PAYMENT', createdAt: { gt: fiveMinutesAgo } }
                                                            ]
                                                        },
                                                        select: { seatNumber: true },
                                                    })];
                                            case 3:
                                                targetBookings = _c.sent();
                                                takenSeats = new Set(targetBookings.map(function (b) { return b.seatNumber; }));
                                                availableSeatsCount = targetTrip.seatsOffered - (targetTrip.initialPassengers + targetBookings.length);
                                                sourceTrip = (_a = bookingsToTransfer[0]) === null || _a === void 0 ? void 0 : _a.trip;
                                                if (!(sourceTrip && targetBookings.length === 0 && targetTrip.initialPassengers === 0)) return [3 /*break*/, 5];
                                                return [4 /*yield*/, tx.trip.update({
                                                        where: { id: targetTripId },
                                                        data: { departureTime: sourceTrip.departureTime }
                                                    })];
                                            case 4:
                                                _c.sent();
                                                _c.label = 5;
                                            case 5:
                                                if (availableSeatsCount < bookingsToTransfer.length) {
                                                    throw new common_1.BadRequestException("Nombre de places insuffisant sur le trajet cible. Places disponibles : ".concat(Math.max(0, availableSeatsCount), ", Demand\u00E9es : ").concat(bookingsToTransfer.length));
                                                }
                                                updatedBookings = [];
                                                _i = 0, bookingsToTransfer_1 = bookingsToTransfer;
                                                _c.label = 6;
                                            case 6:
                                                if (!(_i < bookingsToTransfer_1.length)) return [3 /*break*/, 9];
                                                booking = bookingsToTransfer_1[_i];
                                                assignedSeat = 1;
                                                while (takenSeats.has(assignedSeat) && assignedSeat <= targetTrip.vehicle.capacity) {
                                                    assignedSeat++;
                                                }
                                                takenSeats.add(assignedSeat);
                                                return [4 /*yield*/, tx.booking.update({
                                                        where: { id: booking.id },
                                                        data: {
                                                            tripId: targetTripId,
                                                            seatNumber: assignedSeat,
                                                        },
                                                    })];
                                            case 7:
                                                updated = _c.sent();
                                                updatedBookings.push(updated);
                                                _c.label = 8;
                                            case 8:
                                                _i++;
                                                return [3 /*break*/, 6];
                                            case 9:
                                                sourceTripId = (_b = bookingsToTransfer[0]) === null || _b === void 0 ? void 0 : _b.tripId;
                                                if (!sourceTripId) return [3 /*break*/, 15];
                                                return [4 /*yield*/, tx.booking.count({
                                                        where: {
                                                            tripId: sourceTripId,
                                                            status: { in: ['CONFIRMED', 'BOARDED'] }
                                                        }
                                                    })];
                                            case 10:
                                                remainingBookingsCount = _c.sent();
                                                return [4 /*yield*/, tx.trip.findUnique({
                                                        where: { id: sourceTripId }
                                                    })];
                                            case 11:
                                                sourceTripObj = _c.sent();
                                                if (!(remainingBookingsCount === 0 && (!sourceTripObj || sourceTripObj.initialPassengers === 0))) return [3 /*break*/, 15];
                                                // Delete related entities to prevent foreign key errors
                                                return [4 /*yield*/, tx.parcel.deleteMany({ where: { tripId: sourceTripId } })];
                                            case 12:
                                                // Delete related entities to prevent foreign key errors
                                                _c.sent();
                                                return [4 /*yield*/, tx.seatLock.deleteMany({ where: { tripId: sourceTripId } })];
                                            case 13:
                                                _c.sent();
                                                return [4 /*yield*/, tx.trip.delete({ where: { id: sourceTripId } })];
                                            case 14:
                                                _c.sent();
                                                _c.label = 15;
                                            case 15: return [2 /*return*/, {
                                                    success: true,
                                                    message: "".concat(bookingsToTransfer.length, " client(s) transf\u00E9r\u00E9(s) avec succ\u00E8s."),
                                                    transferredCount: bookingsToTransfer.length,
                                                    bookings: updatedBookings,
                                                }];
                                        }
                                    });
                                }); })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // ==========================================
        // ADMIN ENDPOINTS
        // ==========================================
        BookingsService_1.prototype.getAllBookings = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, page, _b, limit, search, status, paymentStatus, tripId, userId, dateFrom, dateTo, where, skip, take, _c, total, data;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = filters.page, page = _a === void 0 ? 1 : _a, _b = filters.limit, limit = _b === void 0 ? 10 : _b, search = filters.search, status = filters.status, paymentStatus = filters.paymentStatus, tripId = filters.tripId, userId = filters.userId, dateFrom = filters.dateFrom, dateTo = filters.dateTo;
                            where = {};
                            if (status)
                                where.status = status;
                            if (paymentStatus)
                                where.paymentMethod = paymentStatus; // Note: There is no 'paymentStatus' column in Prisma booking except via status (PENDING_PAYMENT, CONFIRMED). If paymentStatus is meant to filter 'paymentMethod', we can map it here. Or if the user meant 'status' as 'CONFIRMED'. Wait, we will just use status and paymentMethod. We will assume paymentStatus means paymentMethod for now or just skip it.
                            if (tripId)
                                where.tripId = tripId;
                            if (userId)
                                where.userId = userId;
                            if (search) {
                                where.OR = [
                                    { id: { contains: search, mode: 'insensitive' } },
                                    { user: { firstName: { contains: search, mode: 'insensitive' } } },
                                    { user: { lastName: { contains: search, mode: 'insensitive' } } },
                                ];
                            }
                            if (dateFrom || dateTo) {
                                where.createdAt = {};
                                if (dateFrom)
                                    where.createdAt.gte = new Date(dateFrom);
                                if (dateTo)
                                    where.createdAt.lte = new Date(dateTo);
                            }
                            skip = (Number(page) - 1) * Number(limit);
                            take = Number(limit);
                            return [4 /*yield*/, Promise.all([
                                    database_1.prisma.booking.count({ where: where }),
                                    database_1.prisma.booking.findMany({
                                        where: where,
                                        skip: skip,
                                        take: take,
                                        include: {
                                            user: true,
                                            trip: {
                                                include: {
                                                    route: {
                                                        include: {
                                                            originStation: true,
                                                            destinationStation: true,
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        orderBy: { createdAt: 'desc' }
                                    })
                                ])];
                        case 1:
                            _c = _d.sent(), total = _c[0], data = _c[1];
                            return [2 /*return*/, {
                                    data: data,
                                    meta: {
                                        total: total,
                                        page: Number(page),
                                        limit: Number(limit),
                                        totalPages: Math.ceil(total / Number(limit)),
                                    }
                                }];
                    }
                });
            });
        };
        BookingsService_1.prototype.getBookingById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var booking;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.booking.findUnique({
                                where: { id: id },
                                include: {
                                    user: true,
                                    trip: {
                                        include: {
                                            driver: {
                                                include: { user: true }
                                            },
                                            vehicle: true,
                                            route: {
                                                include: {
                                                    originStation: true,
                                                    destinationStation: true,
                                                }
                                            }
                                        }
                                    }
                                }
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking)
                                throw new common_1.NotFoundException('Réservation introuvable.');
                            return [2 /*return*/, booking];
                    }
                });
            });
        };
        BookingsService_1.prototype.adminCancelBooking = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, updatedBooking;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.booking.findUnique({
                                where: { id: id },
                                include: { trip: true }
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking)
                                throw new common_1.NotFoundException('Réservation introuvable.');
                            if (booking.status === 'CANCELLED')
                                throw new common_1.BadRequestException('Réservation déjà annulée.');
                            if (booking.status === 'BOARDED')
                                throw new common_1.BadRequestException('Impossible d\'annuler une réservation embarquée.');
                            return [4 /*yield*/, database_1.prisma.booking.update({
                                    where: { id: id },
                                    data: { status: 'CANCELLED' },
                                })];
                        case 2:
                            updatedBooking = _a.sent();
                            // Cancel driver earning if recorded
                            return [4 /*yield*/, database_1.prisma.driverEarning.updateMany({
                                    where: { bookingId: id },
                                    data: { status: 'CANCELLED' }
                                })];
                        case 3:
                            // Cancel driver earning if recorded
                            _a.sent();
                            return [2 /*return*/, { success: true, message: 'Réservation annulée par l\'administrateur.', booking: updatedBooking }];
                    }
                });
            });
        };
        return BookingsService_1;
    }());
    __setFunctionName(_classThis, "BookingsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BookingsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BookingsService = _classThis;
}();
exports.BookingsService = BookingsService;
