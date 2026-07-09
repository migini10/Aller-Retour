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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var database_1 = require("@aller-retour/database");
var bcrypt = __importStar(require("bcrypt"));
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(jwtService, notificationsService) {
            this.jwtService = jwtService;
            this.notificationsService = notificationsService;
            this.forgotPasswordOtps = new Map();
        }
        AuthService_1.prototype.validatePinStrength = function (pin) {
            if (pin.length !== 6) {
                throw new common_1.BadRequestException("Le code PIN doit comporter exactement 6 chiffres.");
            }
            if (/^(\d)\1{5}$/.test(pin)) {
                throw new common_1.BadRequestException("Code PIN trop faible : évitez les chiffres identiques (ex: 000000).");
            }
            if (pin === '123456' || pin === '654321' || pin === '012345') {
                throw new common_1.BadRequestException("Code PIN trop faible : évitez les suites logiques.");
            }
            // Rejeter les formats de date de naissance (JJ/MM/AA)
            if (/^(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])(\d{2})$/.test(pin)) {
                throw new common_1.BadRequestException("Code PIN trop faible : l'utilisation d'une date de naissance (JJMMAA) est interdite pour votre sécurité.");
            }
            // Rejeter les formats commençant par une année de naissance (ex: 1990xx, 2000xx)
            if (/^(19[5-9]\d|20[0-2]\d)\d{2}$/.test(pin)) {
                throw new common_1.BadRequestException("Code PIN trop faible : l'utilisation d'une année de naissance est interdite.");
            }
        };
        AuthService_1.prototype.formatPhone = function (phone) {
            var clean = phone.replace(/\s+/g, '');
            if (!clean.startsWith('+221') && !clean.startsWith('221') && !clean.startsWith('00221')) {
                return "+221".concat(clean);
            }
            else if (clean.startsWith('221')) {
                return "+".concat(clean);
            }
            else if (clean.startsWith('00221')) {
                return clean.replace('00221', '+221');
            }
            return clean;
        };
        AuthService_1.prototype.registerPassenger = function (phoneRaw, fullName, pin) {
            return __awaiter(this, void 0, void 0, function () {
                var phone, existing, passwordHash, _a, user, token, _b, _, safeUser;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            phone = this.formatPhone(phoneRaw);
                            return [4 /*yield*/, database_1.prisma.user.findUnique({ where: { phone: phone } })];
                        case 1:
                            existing = _c.sent();
                            if (existing) {
                                throw new common_1.BadRequestException("Ce numéro de téléphone est déjà enregistré.");
                            }
                            if (pin) {
                                this.validatePinStrength(pin);
                            }
                            if (!pin) return [3 /*break*/, 3];
                            return [4 /*yield*/, bcrypt.hash(pin, 10)];
                        case 2:
                            _a = _c.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, bcrypt.hash('123456', 10)];
                        case 4:
                            _a = _c.sent();
                            _c.label = 5;
                        case 5:
                            passwordHash = _a;
                            return [4 /*yield*/, database_1.prisma.user.create({
                                    data: {
                                        phone: phone,
                                        fullName: fullName,
                                        role: database_1.UserRole.PASSENGER,
                                        passwordHash: passwordHash,
                                    },
                                })];
                        case 6:
                            user = _c.sent();
                            token = this.generateToken(user);
                            _b = user, _ = _b.passwordHash, safeUser = __rest(_b, ["passwordHash"]);
                            return [2 /*return*/, { success: true, user: safeUser, token: token }];
                    }
                });
            });
        };
        AuthService_1.prototype.loginWithMobile = function (phoneRaw, pin) {
            return __awaiter(this, void 0, void 0, function () {
                var phone, user, now, remainingMs, remainingHours, currentFailedAttempts, isPinValid, needsMigration, newAttempts, blockedUntilDate, message, dataToUpdate, _a, token, _b, _, safeUser;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            phone = this.formatPhone(phoneRaw);
                            return [4 /*yield*/, database_1.prisma.user.findUnique({ where: { phone: phone } })];
                        case 1:
                            user = _c.sent();
                            if (!user || !user.isActive) {
                                throw new common_1.UnauthorizedException("Numéro de téléphone incorrect ou compte inactif.");
                            }
                            now = new Date();
                            // 1. Check if the user is currently blocked
                            if (user.blockedUntil && user.blockedUntil > now) {
                                remainingMs = user.blockedUntil.getTime() - now.getTime();
                                remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
                                throw new common_1.UnauthorizedException("Votre compte est bloqu\u00E9 suite \u00E0 4 tentatives incorrectes. Veuillez contacter le service client ou r\u00E9essayer dans ".concat(remainingHours, " heure(s)."));
                            }
                            currentFailedAttempts = user.failedAttempts;
                            if (!(user.blockedUntil && user.blockedUntil <= now)) return [3 /*break*/, 3];
                            currentFailedAttempts = 0;
                            return [4 /*yield*/, database_1.prisma.user.update({
                                    where: { id: user.id },
                                    data: {
                                        failedAttempts: 0,
                                        blockedUntil: null,
                                    },
                                })];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3:
                            isPinValid = false;
                            needsMigration = false;
                            if (!(user.passwordHash && user.passwordHash.startsWith('$2'))) return [3 /*break*/, 5];
                            return [4 /*yield*/, bcrypt.compare(pin, user.passwordHash)];
                        case 4:
                            isPinValid = _c.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            // Legacy plaintext PIN
                            isPinValid = user.passwordHash === pin;
                            if (isPinValid) {
                                needsMigration = true;
                            }
                            _c.label = 6;
                        case 6:
                            if (!!isPinValid) return [3 /*break*/, 8];
                            newAttempts = currentFailedAttempts + 1;
                            blockedUntilDate = null;
                            message = "";
                            if (newAttempts >= 4) {
                                blockedUntilDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Block for 24h
                                message = "Votre compte est bloqué pour 24h suite à 4 tentatives infructueuses. Veuillez contacter le service client ou réesssayez plus tard.";
                            }
                            else {
                                message = "Code PIN incorrect. Tentative ".concat(newAttempts, "/4.");
                            }
                            return [4 /*yield*/, database_1.prisma.user.update({
                                    where: { id: user.id },
                                    data: {
                                        failedAttempts: newAttempts,
                                        blockedUntil: blockedUntilDate,
                                    },
                                })];
                        case 7:
                            _c.sent();
                            throw new common_1.UnauthorizedException(message);
                        case 8:
                            if (!(user.failedAttempts > 0 || user.blockedUntil !== null || needsMigration)) return [3 /*break*/, 12];
                            dataToUpdate = {
                                failedAttempts: 0,
                                blockedUntil: null,
                            };
                            if (!needsMigration) return [3 /*break*/, 10];
                            _a = dataToUpdate;
                            return [4 /*yield*/, bcrypt.hash(pin, 10)];
                        case 9:
                            _a.passwordHash = _c.sent();
                            _c.label = 10;
                        case 10: return [4 /*yield*/, database_1.prisma.user.update({
                                where: { id: user.id },
                                data: dataToUpdate,
                            })];
                        case 11:
                            _c.sent();
                            _c.label = 12;
                        case 12:
                            token = this.generateToken(user);
                            _b = user, _ = _b.passwordHash, safeUser = __rest(_b, ["passwordHash"]);
                            return [2 /*return*/, { success: true, user: safeUser, token: token }];
                    }
                });
            });
        };
        AuthService_1.prototype.sendForgotPasswordOtp = function (phoneRaw) {
            return __awaiter(this, void 0, void 0, function () {
                var phone, user, otp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            phone = this.formatPhone(phoneRaw);
                            return [4 /*yield*/, database_1.prisma.user.findUnique({ where: { phone: phone } })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.BadRequestException("Aucun compte n'est enregistré avec ce numéro de téléphone.");
                            }
                            otp = Math.floor(100000 + Math.random() * 900000).toString();
                            this.forgotPasswordOtps.set(phone, {
                                otp: otp,
                                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
                            });
                            return [4 /*yield*/, this.notificationsService.sendNotification({
                                    to: user.email || 'allogoosn@gmail.com', // Fallback as MVP requirement
                                    subject: 'Allogoo - Code de vérification pour réinitialisation du PIN',
                                    html: "\n        <div style=\"font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; border: 1px solid #e2e8f0; border-radius: 12px;\">\n          <div style=\"text-align: center; margin-bottom: 20px;\">\n            <h2 style=\"color: #ea580c; margin: 0;\">Allogoo</h2>\n            <p style=\"font-size: 12px; color: #64748b; margin-top: 5px; text-transform: uppercase; letter-spacing: 1.5px;\">S\u00E9curit\u00E9</p>\n          </div>\n          <p>Bonjour <strong>".concat(user.fullName, "</strong>,</p>\n          <p>Vous avez demand\u00E9 la r\u00E9initialisation de votre code PIN de connexion.</p>\n          <p>Saisissez le code de v\u00E9rification suivant sur l'application :</p>\n          <div style=\"font-size: 28px; font-weight: bold; background: #f8fafc; border: 1.5px dashed #cbd5e1; padding: 15px; text-align: center; border-radius: 10px; letter-spacing: 8px; margin: 25px 0; color: #0f172a;\">\n            ").concat(otp, "\n          </div>\n          <p style=\"font-size: 12px; color: #64748b;\">Ce code est \u00E0 usage unique et reste valide pendant 10 minutes.</p>\n          <p style=\"font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 25px;\">\n            Si vous n'\u00EAtes pas \u00E0 l'origine de cette demande, vous pouvez ignorer cet e-mail en toute s\u00E9curit\u00E9.\n          </p>\n        </div>\n      "),
                                    safeContent: 'Un email contenant le code OTP de réinitialisation de PIN a été envoyé (le code est masqué pour des raisons de sécurité).',
                                    recipientId: user.id
                                })];
                        case 2:
                            _a.sent();
                            console.log("[Forgot Password] Sent OTP ".concat(otp, " to phone ").concat(phone, " (Email: ").concat(user.email || 'allogoosn@gmail.com', ")"));
                            return [2 /*return*/, { success: true, message: "Un code de vérification a été envoyé par e-mail." }];
                    }
                });
            });
        };
        AuthService_1.prototype.resetPasswordWithOtp = function (phoneRaw, code, newPin) {
            return __awaiter(this, void 0, void 0, function () {
                var phone, user, record, hashedPin;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            phone = this.formatPhone(phoneRaw);
                            return [4 /*yield*/, database_1.prisma.user.findUnique({ where: { phone: phone } })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.BadRequestException("Utilisateur non trouvé.");
                            }
                            record = this.forgotPasswordOtps.get(phone);
                            if (!record || record.expiresAt < new Date() || record.otp !== code) {
                                throw new common_1.BadRequestException("Code de vérification incorrect ou expiré.");
                            }
                            this.validatePinStrength(newPin);
                            return [4 /*yield*/, bcrypt.hash(newPin, 10)];
                        case 2:
                            hashedPin = _a.sent();
                            return [4 /*yield*/, database_1.prisma.user.update({
                                    where: { id: user.id },
                                    data: {
                                        passwordHash: hashedPin,
                                        failedAttempts: 0,
                                        blockedUntil: null,
                                    },
                                })];
                        case 3:
                            _a.sent();
                            this.forgotPasswordOtps.delete(phone);
                            return [2 /*return*/, { success: true, message: "Votre code PIN a été mis à jour avec succès." }];
                    }
                });
            });
        };
        AuthService_1.prototype.unblockUser = function (phoneRaw) {
            return __awaiter(this, void 0, void 0, function () {
                var phone, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            phone = this.formatPhone(phoneRaw);
                            return [4 /*yield*/, database_1.prisma.user.findUnique({ where: { phone: phone } })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.BadRequestException("Aucun utilisateur trouvé avec ce numéro.");
                            }
                            return [4 /*yield*/, database_1.prisma.user.update({
                                    where: { id: user.id },
                                    data: {
                                        failedAttempts: 0,
                                        blockedUntil: null,
                                    },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { success: true, message: "Le compte a été débloqué avec succès." }];
                    }
                });
            });
        };
        AuthService_1.prototype.verifyUserPin = function (userId, pin) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isPinValid, needsMigration, _a, _b;
                var _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, database_1.prisma.user.findUnique({ where: { id: userId } })];
                        case 1:
                            user = _e.sent();
                            if (!user)
                                throw new common_1.BadRequestException("Utilisateur introuvable.");
                            isPinValid = false;
                            needsMigration = false;
                            if (!(user.passwordHash && user.passwordHash.startsWith('$2'))) return [3 /*break*/, 3];
                            return [4 /*yield*/, bcrypt.compare(pin, user.passwordHash)];
                        case 2:
                            isPinValid = _e.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            isPinValid = user.passwordHash === pin;
                            if (isPinValid) {
                                needsMigration = true;
                            }
                            _e.label = 4;
                        case 4:
                            if (!isPinValid) {
                                throw new common_1.BadRequestException("Code secret de connexion incorrect.");
                            }
                            if (!needsMigration) return [3 /*break*/, 7];
                            _b = (_a = database_1.prisma.user).update;
                            _c = {
                                where: { id: user.id }
                            };
                            _d = {};
                            return [4 /*yield*/, bcrypt.hash(pin, 10)];
                        case 5: return [4 /*yield*/, _b.apply(_a, [(_c.data = (_d.passwordHash = _e.sent(), _d),
                                    _c)])];
                        case 6:
                            _e.sent();
                            _e.label = 7;
                        case 7: return [2 /*return*/, { success: true, message: "Code PIN valide." }];
                    }
                });
            });
        };
        AuthService_1.prototype.generateToken = function (user) {
            var payload = { sub: user.id, phone: user.phone, role: user.role, companyId: user.companyId };
            return this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET || 'super-secret-key-panafrican-aller-retour-2026',
                expiresIn: '7d',
            });
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
