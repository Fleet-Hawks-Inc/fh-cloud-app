<style>
    .extra {
        display: none;
    }
</style>
<section class="body">
    <div class="inner-wrapper">
        <section role="main" class="content-body pl-1 pt-0 pr-0">
  <header class="page-header pr19 pl11">
        <form class="form-horizontal" method="get">
          <div class="row" style="padding-top: 10px">
            <div class="col-md-2 col-lg-2">
              <div class="input-group input-group-md mb-3">
                <input
                  type="text"
                  autocomplete="off"
                  placeholder="Search Asset"
                  name="assetIdentification"
                  [(ngModel)]="assetIdentification"
                  class="form-control"
                  (input)="getSuggestions($event.target.value)"
                />
              </div>
              <div
                *ngIf="suggestedAssets?.length > 0"
                class="result-suggestions"
              >
                <ul>
                  <li
                    *ngFor="let suggestedAsset of suggestedAssets"
                    style="cursor: pointer"
                    (click)="
                      setAsset(
                        suggestedAsset.assetID,
                        suggestedAsset.assetIdentification
                      )
                    "
                  >
                    {{ suggestedAsset.assetIdentification }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-md-2 col-lg-2 pl-0 pr-0">
              <ng-select
                class="form-control custom"
                name="assetType"
                [(ngModel)]="assetType"
                placeholder="Select Type"
              >
                <ng-option value="container">Container</ng-option>
                <ng-option value="double_drop">Double Drop</ng-option>
                <ng-option value="dump_trailer">Dump Trailer</ng-option>
                <ng-option value="flat_bed">Flat bed</ng-option>
                <ng-option value="lowboy">Lowboy</ng-option>
                <ng-option value="stepDeck">StepDeck</ng-option>
                <ng-option value="removable_gooseneck"
                  >Removable Gooseneck</ng-option
                >
                <ng-option value="dry_van">Dry Van</ng-option>
                <ng-option value="reefer">Reefer</ng-option>
                <ng-option value="power_only">Power Only</ng-option>
                <ng-option value="conestoga_trailer"
                  >Conestoga Trailer</ng-option
                >
                <ng-option value="side_kit_trailer">Side Kit Trailer</ng-option>
                <ng-option value="specialized_trailer"
                  >Specialized Trailer</ng-option
                >
                <ng-option value="enclosed_trailer">Enclosed Trailer</ng-option>
                <ng-option value="scrap_trailer">Scrap Trailer</ng-option>
                <ng-option value="semi_trailer">Semi Trailer</ng-option>
                <ng-option value="chassis">Chassis</ng-option>
                <ng-option value="tank_trailer">Tank Trailer</ng-option>
              </ng-select>
            </div>
            <div class="col-md-2 col-lg-2">
              <button
                type="submit"
                (click)="searchFilter()"
                class="btn btn-sm btn-success mr-3"
              >
                Search
              </button>
              <button
                type="button"
                (click)="resetFilter()"
                class="btn btn-sm btn-success"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </header>
            <section class="m-2">
                <div class="row mb-3">
                    <div class="col-lg-12">
                        <div class="bg-white p-3 text-dark">
                            <div class="form-group row pt-3">
                                <div class="col-lg-12" style="height: calc(100vh - 149px); overflow-y: scroll;">
                                    <p-table #dt [value]="allData" [resizableColumns]="true" columnResizeMode="expand" scrollDirection="both" [columns]="selectedColumns" [loading]="!loaded" styleClass="p-datatable-sm p-datatable-gridlines p-datatable-striped" [scrollable]="true" [loading]="!loaded"
                                        scrollHeight="100%">
                                        <!-- Caption template of data table -->
                                        <ng-template pTemplate="caption">

                                            <div class="p-d-flex d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h3 class="m-0"> Assets </h3>
                                                </div>
                                                <div class="text-right">
                                                    <span>Showing {{allData.length}} entries </span> &nbsp;
                                                    <button type="button" pButton (click)="refreshData()" pTooltip="Refresh" class="p-button-outlined mr-2" icon="fas fa-sync"></button>
                                                    <button type="button" pButton pTooltip="Add" routerLink="/fleet/assets/add" class="p-button-outlined mr-2" icon="pi pi-plus"></button>
                                                    <button pButton pRipple pTooltip="Clear Filter" class="p-button-outlined mr-2" icon="pi pi-filter-slash" (click)="clear(dt)"></button>
                                                    <button type="button" pButton pRipple class="p-button-outlined mr-2" icon="fas fa-regular fa-file-excel" (click)="generateVehicleCSV()" pTooltip="Excel"></button>
                                                    <p-multiSelect [options]="dataColumns" [(ngModel)]="selectedColumns" optionLabel="header" selectedItemsLabel="{0} columns selected" [style]="{minWidth: '200px'}" placeholder="Choose Columns">
                                                    </p-multiSelect>
                                                </div>
                                            </div>
                                        </ng-template>
                                        <!-- Header template of DataTable -->
                                        <ng-template pTemplate="header" let-columns>
                                            <tr>
                                                <th *ngFor="let dataColumns of columns" [pSortableColumn]="dataColumns.field" pResizableColumn [ngStyle]="{'width': dataColumns.width}">
                                                    <div [ngSwitch]="dataColumns.field">
                                                        <!-- Asset Status Filter Customization -->
                                                        <span *ngSwitchCase="'currentStatus'">
                                                            <div class="flex justify-content-center align-items-center"
                                                                alignFrozen="left" pFrozenColumn [frozen]="true">
                                                                {{dataColumns.header}}
                                                                <p-sortIcon [field]="dataColumns.field"></p-sortIcon>
                                                                <p-columnFilter [type]="dataColumns.type"
                                                                    [field]="dataColumns.field" [showOperator]="false"
                                                                    matchMode="contains" [showMatchModes]="false"
                                                                    [showAddButton]="false" display="menu">
                                                                    <ng-template pTemplate="filter" let-value
                                                                        let-filter="filterCallback">
                                                                        <p-multiSelect
                                                                            [options]="[ { name:'Active', value:'active'},{name: 'InActive', value:'inactive'}]"
                                                                            placeholder="Any"
                                                                            (onChange)="filter($event.value)"
                                                                            optionLabel="name" optionValue="value">
                                                                            <ng-template let-option pTemplate="item">
                                                                                <div>
                                                                                    <span class="ml-1">{{option.name
                                                                                        }}</span>
                                                    </div>
                                        </ng-template>
                                        </p-multiSelect>
                                        </ng-template>
                                        </p-columnFilter>
                                </div>
                                </span>
                                <span *ngSwitchDefault>
                                                            <div class="flex justify-content-center align-items-center"
                                                                alignFrozen="right" pFrozenColumn [frozen]="true">
                                                                {{dataColumns.header}}
                                                                <p-sortIcon [field]="dataColumns.field"></p-sortIcon>
                                                                <p-columnFilter [type]="dataColumns.type"
                                                                    [field]="dataColumns.field" matchMode="contains"
                                                                    [showMatchModes]="false" [showOperator]="false"
                                                                    [showAddButton]="false" display="menu">
                                                                </p-columnFilter>
                                                            </div>
                                                        </span>
                            </div>
                            </th>
                            <th style="width: 130px;" alignFrozen="right" pFrozenColumn [frozen]="true">Actions</th>

                            </tr>

                            </ng-template>

                            <!-- Body Template of Data Table -->
                            <ng-template pTemplate="body" let-asset let-columns="columns" let-rowIndex="rowIndex">

                                <tr>
                                    <td *ngFor="let dataColumns of columns" [ngStyle]="{'width': dataColumns.width}" style="cursor: pointer;" routerLink="/fleet/assets/detail/{{asset.assetID}}">
                                        <div [ngSwitch]="dataColumns.field">
                                            <span *ngSwitchCase="'assetIdentification'">{{asset.assetIdentification
                                                            | titlecase }}</span>
                                            <span *ngSwitchCase="'VIN'">
                                                            {{asset.ownerShip !== "interchange" ? asset.VIN: "-"}}
                                                        </span>
                                            <span *ngSwitchCase="'assetType'"> {{((asset.assetType) ?
                                                            (asset.assetType.replace('_',' ')) : '-') |
                                                            titlecase}}</span>
                                            <span *ngSwitchCase="'manufacturer'"> {{((asset.manufacturer) ?
                                                            asset.manufacturer : '-') | titlecase}}</span>
                                            <span *ngSwitchCase="'year'"> {{((asset.year) ? asset.year :
                                                            '-') | titlecase}}</span>
                                            <span *ngSwitchCase="'ownerShip'"> {{((asset.ownerShip) ?
                                                            asset.ownerShip : "-") | titlecase}} </span>

                                            <span *ngSwitchCase="'operatorCompany'">
                                                   <span *ngIf="asset.ownerShip === 'ownerOperator'">
                                                      {{asset.ownerOperator ? contactsObjects[asset.ownerOperator]: "-"}}
                                                                </span>
                                            <span *ngIf="asset.ownerShip === 'rented'">
                                                          {{asset.ownCname ? asset.ownCname: "-"}}
                                                                </span>
                                            <span *ngIf="asset.ownerShip === 'leased'">
                                                         {{asset.ownCname ? asset.ownCname: "-"}} </span>
                                            </span>


                                            <span *ngSwitchCase="'currentStatus'">
                                                            <span class="badge badge-dark p-1">{{ asset.currentStatus 
                                                                titlecase }}</span>
                                            </span>
                                            <span *ngSwitchDefault> {{get(asset,dataColumns.field)}}</span>
                                        </div>
                                    </td>
                                    <td style=" text-align: center; width: 130px;" pFrozenColumn alignFrozen="right" [frozen]="true">

                                        <button id="btnEdit" pButton routerLink="/fleet/assets/edit/{{asset.assetID}}" type="button" icon="fas fa-user-pen" class="p-button-rounded p-button-text"></button>
                                        <button id="btnDelete" (click)="deleteAsset(asset)" pButton type="button" icon="fas fa-user-slash" class="p-button-rounded p-button-danger p-button-text"></button>
                                    </td>
                                </tr>
                            </ng-template>
                            <!-- Empty Template -->

                            <ng-template pTemplate="emptymessage" let-columns>
                                <div class="col-lg-12 mt-3 text-center">
                                    {{dataMessage}}
                                    <br /><br>
                                </div>
                            </ng-template>
                            <!-- Summary Section with Load More button -->

                            <ng-template pTemplate="summary" let-columns>
                            <div class="col-lg-12 mt-3 text-center " *ngIf="lastEvaluatedKey !=='end' && allData.length !==0 ">
                                    <button type="button " (click)="onScroll($event) " class="btn btn-success btn-sm text-light ">Load
                                                    More..</button>
                                    <br /><br>
                                </div>
                                <div class="col-lg-12 mt-3 text-center" *ngIf="lastEvaluatedKey ==='end'">
                                    Total Records: {{allData.length}}</div>
                            </ng-template>


                            </p-table>


                        </div>

                    </div>
                </div>

    </div>
    </div>
    </section>


    </section>
    </div>
</section>
