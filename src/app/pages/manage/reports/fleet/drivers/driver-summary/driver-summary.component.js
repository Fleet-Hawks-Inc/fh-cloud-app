"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
exports.DriverSummaryComponent = void 0;
var core_1 = require("@angular/core");
var constants_1 = require("src/app/pages/fleet/constants");
var moment = require("moment");
var DriverSummaryComponent = /** @class */ (function () {
    function DriverSummaryComponent(apiService, router, toastr, spinner) {
        this.apiService = apiService;
        this.router = router;
        this.toastr = toastr;
        this.spinner = spinner;
        this.dataMessage = constants_1["default"].FETCHING_DATA;
        this.drivers = [];
        this.activeDrivers = 0;
        this.inActiveDrivers = 0;
        this.totalDriversCount = 0;
        this.driverID = '';
        this.firstName = '';
        this.lastName = '';
        this.searchValue = '';
        this.driverStatus = null;
        this.driverName = '';
        this.driverNext = false;
        this.driverPrev = true;
        this.disableSearch = false;
        this.lastItemSK = '';
        this.loaded = false;
    }
    DriverSummaryComponent.prototype.ngOnInit = function () {
        //this.fetchDrivers();
        this.countDrivers();
        this.fetchDriverReport();
    };
    DriverSummaryComponent.prototype.fetchDrivers = function () {
        var _this = this;
        this.inActiveDrivers = 0;
        this.activeDrivers = 0;
        this.apiService.getData("drivers/fetch/summary/list?name=" + this.driverName + "&driverStatus=" + this.driverStatus).subscribe(function (result) {
            for (var i = 0; i < result.Items.length; i++) {
                var drivers = result.Items[i];
                if (drivers.driverStatus === 'inActive') {
                    _this.inActiveDrivers = _this.inActiveDrivers += 1;
                }
                else {
                    _this.activeDrivers = _this.activeDrivers += 1;
                }
            }
            _this.drivers = result.Items;
            console.log('driver', _this.drivers);
        });
    };
    DriverSummaryComponent.prototype.fetchDriverReport = function (refresh) {
        return __awaiter(this, void 0, void 0, function () {
            var result_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (refresh === true) {
                            this.lastItemSK = '',
                                this.drivers = [];
                        }
                        if (!(this.lastItemSK !== 'end')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.apiService.getData("drivers/paging/list?lastKey=" + this.lastItemSK).toPromise()];
                    case 1:
                        result_1 = _a.sent();
                        this.dataMessage = constants_1["default"].FETCHING_DATA;
                        if (result_1.Items.length === 0) {
                            this.dataMessage = constants_1["default"].NO_RECORDS_FOUND;
                        }
                        if (result_1.Items.length > 0) {
                            if (result_1.LastEvaluatedKey !== undefined) {
                                this.lastItemSK = encodeURIComponent(result_1.Items[result_1.Items.length - 1].driverSK);
                            }
                            else {
                                this.lastItemSK = 'end';
                            }
                            this.drivers = this.drivers.concat(result_1.Items);
                            //this.countDrivers();
                            //this.drivers = result.Items;
                            this.loaded = true;
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    DriverSummaryComponent.prototype.onScroll = function () {
        if (this.loaded) {
            this.fetchDriverReport();
        }
        this.loaded = false;
    };
    DriverSummaryComponent.prototype.countDrivers = function () {
        var _this = this;
        this.apiService.getData("drivers").subscribe(function (result) {
            for (var i = 0; i < result.Items.length; i++) {
                var drivers = result.Items[i];
                if (drivers.driverStatus === 'inActive') {
                    _this.inActiveDrivers = _this.inActiveDrivers += 1;
                }
                else {
                    _this.activeDrivers = _this.activeDrivers += 1;
                }
                _this.totalDriversCount = result.Count;
            }
        });
    };
    DriverSummaryComponent.prototype.searchDriver = function () {
        if (this.driverName !== '' || this.driverStatus !== '') {
            this.driverName = this.driverName.toLowerCase();
            this.driverStatus = this.driverStatus;
            this.drivers = [];
            this.dataMessage = constants_1["default"].FETCHING_DATA;
            this.fetchDrivers();
            //this.fetchDriverReport();
        }
        else {
            return false;
        }
    };
    DriverSummaryComponent.prototype.resetDriver = function () {
        if (this.driverName !== '' || this.driverStatus !== '' || this.lastItemSK !== '') {
            this.drivers = [];
            this.driverStatus = '';
            this.driverName = '';
            this.lastItemSK = '';
            this.dataMessage = constants_1["default"].FETCHING_DATA;
            this.fetchDrivers();
            //this.fetchDriverReport();
        }
        else {
            return false;
        }
    };
    DriverSummaryComponent.prototype.generateDriverCSV = function () {
        if (this.drivers.length > 0) {
            var dataObject_1 = [];
            var csvArray_1 = [];
            this.drivers.forEach(function (element) {
                var obj = {};
                obj["Name"] = element.firstName;
                obj["Email"] = element.email;
                obj["driverType"] = element.driverType;
                obj["Date of Birth"] = element.DOB + " " + element.DOB;
                obj["Gender"] = element.gender;
                obj["CDL#"] = element.CDL_Number;
                obj["Phone"] = element.phone;
                obj["Status"] = element.driverStatus;
                dataObject_1.push(obj);
            });
            var headers = Object.keys(dataObject_1[0]).join(',');
            headers += '\n';
            csvArray_1.push(headers);
            dataObject_1.forEach(function (element) {
                var obj = Object.values(element).join(',');
                obj += '\n';
                csvArray_1.push(obj);
            });
            var blob = new Blob(csvArray_1, { type: 'text/csv;charset=utf-8;' });
            var link = document.createElement('a');
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', moment().format("YYYY-MM-DD:HH:m") + "Driver-Report.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        else {
            this.toastr.error("No Records found");
        }
    };
    DriverSummaryComponent = __decorate([
        (0, core_1.Component)({
            selector: 'app-driver-summary',
            templateUrl: './driver-summary.component.html',
            styleUrls: ['./driver-summary.component.css']
        })
    ], DriverSummaryComponent);
    return DriverSummaryComponent;
}());
exports.DriverSummaryComponent = DriverSummaryComponent;
