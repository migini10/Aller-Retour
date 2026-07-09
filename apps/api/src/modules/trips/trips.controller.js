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
exports.TripsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var passport_1 = require("@nestjs/passport");
var rbac_guard_1 = require("../../core/rbac/rbac.guard");
var roles_decorator_1 = require("../../core/rbac/roles.decorator");
var database_1 = require("@aller-retour/database");
var TripsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Trips & Mobility'), (0, common_1.Controller)('trips')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _searchTrips_decorators;
    var _getPopularPrices_decorators;
    var _getManifest_decorators;
    var _createAlloDakarTrip_decorators;
    var _updateTrip_decorators;
    var _deleteTrip_decorators;
    var _toggleLock_decorators;
    var _getTransferTargets_decorators;
    var TripsController = _classThis = /** @class */ (function () {
        function TripsController_1(tripsService) {
            this.tripsService = (__runInitializers(this, _instanceExtraInitializers), tripsService);
        }
        TripsController_1.prototype.searchTrips = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tripsService.searchTrips(dto)];
                });
            });
        };
        TripsController_1.prototype.getPopularPrices = function (origin, destination) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tripsService.getPopularPrices(origin, destination)];
                });
            });
        };
        TripsController_1.prototype.getManifest = function (tripId, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tripsService.getManifest(tripId, req.user.id, req.user.role)];
                });
            });
        };
        TripsController_1.prototype.createAlloDakarTrip = function (req, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tripsService.createAlloDakarTrip(req.user.id, dto)];
                });
            });
        };
        TripsController_1.prototype.updateTrip = function (id, req, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tripsService.updateTrip(id, req.user.id, req.user.role, dto)];
                });
            });
        };
        TripsController_1.prototype.deleteTrip = function (id, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tripsService.deleteTrip(id, req.user.id, req.user.role)];
                });
            });
        };
        TripsController_1.prototype.toggleLock = function (id, req, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tripsService.toggleLock(id, req.user.id, req.user.role, body === null || body === void 0 ? void 0 : body.code)];
                });
            });
        };
        TripsController_1.prototype.getTransferTargets = function (id, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tripsService.getTransferTargets(id, req.user.id, req.user.role)];
                });
            });
        };
        return TripsController_1;
    }());
    __setFunctionName(_classThis, "TripsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _searchTrips_decorators = [(0, common_1.Get)('search'), (0, swagger_1.ApiOperation)({ summary: 'Rechercher des trajets inter-urbains (SaaS & Marketplace)' })];
        _getPopularPrices_decorators = [(0, common_1.Get)('popular-prices'), (0, swagger_1.ApiOperation)({ summary: 'Obtenir les prix les plus populaires pour un trajet donné' })];
        _getManifest_decorators = [(0, common_1.Get)(':id/manifest'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.DRIVER), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Télécharger le manifeste des passagers (Offline Cache pour Chauffeur)' })];
        _createAlloDakarTrip_decorators = [(0, common_1.Post)('create-allo-dakar'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.DRIVER), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Créer un trajet Allo Dakar par un chauffeur' })];
        _updateTrip_decorators = [(0, common_1.Patch)(':id'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.DRIVER), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Modifier un trajet' })];
        _deleteTrip_decorators = [(0, common_1.Delete)(':id'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.DRIVER), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Supprimer un trajet' })];
        _toggleLock_decorators = [(0, common_1.Patch)(':id/toggle-lock'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.DRIVER), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Verrouiller ou déverrouiller un trajet' })];
        _getTransferTargets_decorators = [(0, common_1.Get)(':id/transfer-targets'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard), (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.DRIVER), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Trouver des trajets alternatifs éligibles pour un transfert de passagers' })];
        __esDecorate(_classThis, null, _searchTrips_decorators, { kind: "method", name: "searchTrips", static: false, private: false, access: { has: function (obj) { return "searchTrips" in obj; }, get: function (obj) { return obj.searchTrips; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPopularPrices_decorators, { kind: "method", name: "getPopularPrices", static: false, private: false, access: { has: function (obj) { return "getPopularPrices" in obj; }, get: function (obj) { return obj.getPopularPrices; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getManifest_decorators, { kind: "method", name: "getManifest", static: false, private: false, access: { has: function (obj) { return "getManifest" in obj; }, get: function (obj) { return obj.getManifest; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createAlloDakarTrip_decorators, { kind: "method", name: "createAlloDakarTrip", static: false, private: false, access: { has: function (obj) { return "createAlloDakarTrip" in obj; }, get: function (obj) { return obj.createAlloDakarTrip; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateTrip_decorators, { kind: "method", name: "updateTrip", static: false, private: false, access: { has: function (obj) { return "updateTrip" in obj; }, get: function (obj) { return obj.updateTrip; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteTrip_decorators, { kind: "method", name: "deleteTrip", static: false, private: false, access: { has: function (obj) { return "deleteTrip" in obj; }, get: function (obj) { return obj.deleteTrip; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _toggleLock_decorators, { kind: "method", name: "toggleLock", static: false, private: false, access: { has: function (obj) { return "toggleLock" in obj; }, get: function (obj) { return obj.toggleLock; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTransferTargets_decorators, { kind: "method", name: "getTransferTargets", static: false, private: false, access: { has: function (obj) { return "getTransferTargets" in obj; }, get: function (obj) { return obj.getTransferTargets; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TripsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TripsController = _classThis;
}();
exports.TripsController = TripsController;
