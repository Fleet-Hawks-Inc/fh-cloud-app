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
exports.ActivityComponent = void 0;
var core_1 = require("@angular/core");
var constants_1 = require("src/app/pages/fleet/constants");
var moment = require("moment");
var ActivityComponent = /** @class */ (function () {
    function ActivityComponent(apiService, toastr, route, countryStateCity) {
        this.apiService = apiService;
        this.toastr = toastr;
        this.route = route;
        this.countryStateCity = countryStateCity;
        this.exportData = [];
        this.allData = [];
        this.assetData = [];
        this.startDate = '';
        this.endDate = '';
        this.start = null;
        this.states = [];
        this.stateCode = null;
        this.dummyData = [];
        this.end = null;
        this.assetIdentification = '';
        this.assetID = '';
        this.dataMessage = constants_1["default"].FETCHING_DATA;
        this.lastItemSK = '';
        this.datee = '';
        this.loaded = false;
        this.dateMinLimit = { year: 1950, month: 1, day: 1 };
        this.date = new Date();
        this.futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
    }
    ActivityComponent.prototype.ngOnInit = function () {
        this.end = moment().format("YYYY-MM-DD");
        this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
        this.astId = this.route.snapshot.params["astId"];
        this.fetchAssetActivity();
        this.fetchAsset();
    };
    ActivityComponent.prototype.fetchAsset = function () {
        var _this = this;
        this.apiService.getData("assets/fetch/detail/" + this.astId).subscribe(function (result) {
            _this.assetData = result.Items;
        });
    };
    ActivityComponent.prototype.onScroll = function () {
        if (this.loaded) {
            this.fetchAssetActivity();
        }
        this.loaded = false;
    };
    ActivityComponent.prototype.fetchStates = function (countryCode) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.countryStateCity.GetStatesByCountryCode([
                                countryCode,
                            ])];
                    case 1:
                        _a.states = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ActivityComponent.prototype.fetchAssetActivity = function () {
        var _this = this;
        if (this.lastItemSK !== 'end') {
            this.apiService.getData("trips/get/tripData?asset=" + this.astId + "&startDate=" + this.start + "&endDate=" + this.end + "&lastKey=" + this.lastItemSK + "&date=" + this.datee).subscribe(function (result) {
                if (result.Items.length === 0) {
                    _this.dataMessage = constants_1["default"].NO_RECORDS_FOUND;
                }
                _this.allData = _this.allData.concat(result.Items);
                for (var _i = 0, _a = _this.allData; _i < _a.length; _i++) {
                    var asst = _a[_i];
                    var dataa = asst;
                    asst.miles = 0;
                    for (var _b = 0, _c = dataa.tripPlanning; _b < _c.length; _b++) {
                        var element = _c[_b];
                        asst.miles += Number(element.miles);
                    }
                }
                _this.allData = result.Items;
                console.log('allData==-', _this.allData);
                var _loop_1 = function (data) {
                    console.log(' iftaMiles', data.iftaMiles);
                    data.canMiles = 0;
                    data.usMiles = 0;
                    data.finalData = '';
                    data.usState = 0;
                    data.provData = [];
                    //data.province = 
                    data.provinceData = [];
                    data.vehicleProvinces = [];
                    data.usProvArr = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN",
                        "MS", "MO", "MT", "NE", "NV", "NH", "	NJ", "	NM", "	NY", "NC", "ND", "OH", "OK", "OR", "PA", "PR", "	RI", "SC", "SD", "	TN", "TX", "UT", "VT", "VA", "VI", "WA", "WV", "WI", "WY"];
                    data.canArr = ["AB", "BC", "MB", "NB", "NL", "NF", "NT", "NS", "NU", "ON", "PE", "PQ", "QC", "SK", "Canada", "YT"];
                    data.counter = 0;
                    data.us = [];
                    data.ca = [];
                    data.vehicleIDs.map(function (v) {
                        data.iftaMiles.map(function (ifta) {
                            ifta.map(function (ifta2) {
                                if (ifta2[v] && ifta2[v].length > 0) {
                                    var newObj_1 = {
                                        vehicleID: v,
                                        vehicleName: 'name',
                                        provinces: []
                                    };
                                    ifta2[v].map(function (location) {
                                        if (!data.vehicleProvinces.includes(location.StCntry)) {
                                            data.vehicleProvinces.push(location.StCntry);
                                        }
                                        newObj_1.provinces.push(location);
                                    });
                                    data.provinceData.push(newObj_1);
                                    /*
                                         for(var province of newObj.provinces)
                                        {
                                              if(province.StCntry !== 'US')
                                              {
                                               data.us.push({'cty' : province.StCntry, 'amt' : province.Total});
                                               data.counter++;
                                              }
                                              
                                              if(province.StCntry === 'US' )
                                              {
                                              data.counter++;
                                              break;
                                              }
                                         }
                                         */
                                    for (var i = data.counter; i <= newObj_1.provinces.length; i++) {
                                        if (newObj_1.provinces[i].StCntry !== 'US' && newObj_1.provinces[i].StCntry !== 'Canada') {
                                            data.us.push({ 'cty': newObj_1.provinces[i].StCntry, 'amt': newObj_1.provinces[i].Total });
                                            data.counter++;
                                        }
                                        if (newObj_1.provinces[i].StCntry === 'US') {
                                            data.counter++;
                                            break;
                                        }
                                    }
                                    /*
                                    for(var i=data.counter;i<=newObj.provinces.length;i++)
                                   {
                                         if(newObj.provinces[i].StCntry !== 'Canada')
                                         {
                                          data.ca.push({'cty' : newObj.provinces[i].StCntry, 'amt' : newObj.provinces[i].Total});
                                          data.counter++;
                                         }
                                         if(newObj.provinces[i].StCntry === 'Canada')
                                         {
                                         data.counter++;
                                         break;
                                         }
                                    }
                                    */
                                    /*
                                         for (var i=counter; i<=provinces.length; i++){
                             console.log(provinces[i]);
                             if(provinces[i].StCntry === 'Canada'){ break;}
                             if(provinces[i].StCntry !== 'Canada'){
                             ca.push({ 'cty' : provinces[i].StCntry, 'amt' : provinces[i].Total})
                             }
                             }
                                */
                                    /*
                                                  for (var i=data.counter;i<=newObj.provinces.length; i++)
                                                  {
                                                  console.log(newObj.provinces[i]);
                                                  if(newObj.provinces[i].StCntry === 'Canada')
                                                  {
                                                  break;
                                                  }
                                                  if(newObj.provinces[i].StCntry !== 'Canada')
                                                  {
                                                  data.ca.push({ 'cty' : newObj.provinces[i].StCntry, 'amt' : newObj.provinces[i].Total})
                                                    }
                                                    }
                                               */
                                }
                            });
                        });
                    });
                    for (var _f = 0, _g = data.provinceData; _f < _g.length; _f++) {
                        var item = _g[_f];
                        data.finalData = item;
                        console.log('data.finalData', data.finalData);
                        var provinceDataa = item.provinces;
                        item.provinces.map(function (v) {
                            if (data.usProvArr.includes(v.StCntry)) {
                                data.usMiles += Number(v.Total);
                            }
                            else if (data.canArr.includes(v.StCntry)) {
                                console.log('v.StCntry', v.StCntry);
                                console.log('exx', v);
                                data.canMiles += Number(v.Total);
                            }
                        });
                    }
                    //To filter according stateCode
                    if (_this.stateCode !== null) {
                        _this.allData = [];
                        for (var _h = 0, _j = _this.dummyData; _h < _j.length; _h++) {
                            var data_1 = _j[_h];
                            if (data_1.vehicleProvinces.includes(_this.stateCode)) {
                                if (data_1.vehicleProvinces === 0) {
                                    _this.dataMessage = constants_1["default"].NO_RECORDS_FOUND;
                                }
                                _this.allData.push(data_1);
                                if (_this.allData === 0) {
                                    _this.dataMessage = constants_1["default"].NO_RECORDS_FOUND;
                                }
                            }
                        }
                        if (_this.allData.length === 0) {
                            _this.dataMessage = constants_1["default"].NO_RECORDS_FOUND;
                        }
                    }
                    console.log('data.provinceData', data);
                };
                for (var _d = 0, _e = _this.allData; _d < _e.length; _d++) {
                    var data = _e[_d];
                    _loop_1(data);
                }
                if (result.LastEvaluatedKey !== undefined) {
                    _this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].tripSK);
                    _this.datee = encodeURIComponent(result.Items[result.Items.length - 1].dateCreated);
                }
                else {
                    _this.lastItemSK = 'end';
                }
                _this.loaded = true;
            });
        }
    };
    ActivityComponent.prototype.searchFilter = function () {
        if (this.start != null && this.end != null) {
            if (this.start != null && this.end == null) {
                this.toastr.error('Please select both start and end dates.');
                return false;
            }
            else if (this.start == null && this.end != null) {
                this.toastr.error('Please select both start and end dates.');
                return false;
            }
            else if (this.start > this.end) {
                this.toastr.error('Start Date should be less then end date.');
                return false;
            }
            else {
                this.lastItemSK = '';
                this.allData = [];
                this.dataMessage = constants_1["default"].FETCHING_DATA;
                this.fetchAssetActivity();
            }
        }
        else {
            return false;
        }
    };
    ActivityComponent.prototype.fetchFullExport = function () {
        var _this = this;
        this.apiService.getData("trips/fetch/assetActivity/list?asset=" + this.astId + "&startDate=" + this.start + "&endDate=" + this.end).subscribe(function (result) {
            _this.exportData = result.Items;
            for (var _i = 0, _a = _this.exportData; _i < _a.length; _i++) {
                var asst = _a[_i];
                var dataa = asst;
                asst.miles = 0;
                for (var _b = 0, _c = dataa.tripPlanning; _b < _c.length; _b++) {
                    var element = _c[_b];
                    asst.miles += Number(element.miles);
                }
            }
            _this.generateCSV();
        });
    };
    ActivityComponent.prototype.generateCSV = function () {
        if (this.exportData.length > 0) {
            var dataObject_1 = [];
            var csvArray_1 = [];
            this.exportData.forEach(function (element) {
                var location = '';
                var date = '';
                for (var i = 0; i < element.tripPlanning.length; i++) {
                    var element2 = element.tripPlanning[i];
                    date += element2.type + " : " + element2.date;
                    if (i < element.tripPlanning.length - 1) {
                        date += " & ";
                    }
                    element2.location = element2.location.replace(/,/g, ' ');
                    location += element2.type + ' : ' + element2.location;
                    if (i < element.tripPlanning.length - 1) {
                        location += " & ";
                    }
                }
                var obj = {};
                obj["Asset"] = element.assetName.replace(/, /g, ' &');
                ;
                obj["Trip#"] = element.tripNo;
                obj["Order#"] = element.orderName.replace(/, /g, ' &');
                obj["location"] = location;
                obj["	Date"] = date;
                obj["Total Miles"] = element.miles;
                dataObject_1.push(obj);
            });
            var headers = Object.keys(dataObject_1[0]).join(',');
            headers += ' \n';
            csvArray_1.push(headers);
            dataObject_1.forEach(function (element) {
                var obj = Object.values(element).join(',');
                obj += ' \n';
                csvArray_1.push(obj);
            });
            var blob = new Blob(csvArray_1, { type: 'text/csv;charset=utf-8;' });
            var link = document.createElement('a');
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', moment().format("YYYY-MM-DD:HH:m") + "assetActivity-Report.csv");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        else {
            this.toastr.error("No Records found");
        }
    };
    ActivityComponent = __decorate([
        (0, core_1.Component)({
            selector: 'app-activity',
            templateUrl: './activity.component.html',
            styleUrls: ['./activity.component.css']
        })
    ], ActivityComponent);
    return ActivityComponent;
}());
exports.ActivityComponent = ActivityComponent;
