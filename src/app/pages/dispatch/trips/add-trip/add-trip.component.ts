import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ApiService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
// import { v4 as uuidv4 } from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services/here-map.service';
declare var $: any;

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {

    // trips = [];
    carriers = [];
    constructor(private apiService: ApiService, private awsUS: AwsUploadService, private route: ActivatedRoute,
        private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private hereMap: HereMapService) { }

    trips = [
        {
            type: 'Pick Up 1',
            date: '2020-06-06',
            name: 'ABC Inc',
            location: 'ON,Brampton',
            miles: '',
            truck: '1001',
            trailer: 'TR-34',
            driver: 'Dalwinder',
            coDriver: 'Johhn',
            carrier: 'XYZ ltd',
        },
        {
            type: 'Pick Up 2',
            date: '2020-06-06',
            name: 'ABC Inc',
            location: 'ON,Brampton',
            miles: '',
            truck: '1001',
            trailer: 'TR-34',
            driver: 'Dalwinder',
            coDriver: 'Johhn',
            carrier: 'XYZ ltd',
        },
        {
            type: 'Delivery 1A',
            date: '2020-06-06',
            name: 'MNO Inc',
            location: 'SK,Regina',
            miles: '506 miles',
            truck: '',
            trailer: '',
            driver: '',
            coDriver: '',
            carrier: 'XYZ ltd',
        },
        {
            type: 'Stop',
            date: '2020-06-06',
            name: 'MNO Inc',
            location: 'SK,Regina',
            miles: '506 miles',
            truck: '',
            trailer: '',
            driver: '',
            coDriver: '',
            carrier: 'XYZ ltd',
        },
        {
            type: 'Pick Up 3',
            date: '2020-06-06',
            name: 'ABC Inc',
            location: 'ON,Brampton',
            miles: '',
            truck: '1001',
            trailer: 'TR-34',
            driver: 'Dalwinder',
            coDriver: 'Johhn',
            carrier: 'XYZ ltd',
        }
    ];
    form;

    response: any = '';
    hasError = false;
    hasSuccess = false;
    Error: string = '';
    Success: string = '';
    mapView: boolean = false ;

    ngOnInit() {

        this.fetchCarriers();

        $(document).ready(() => { 
            $('.textRows').css('display','none');

        })
    }

    fetchCarriers(){
        this.apiService.getData('carriers')
          .subscribe((result: any)=>{
            this.carriers = result.Items;
            // console.log(this.carriers);
          })
    }

    drop(event: CdkDragDrop<string[]>) {
        this.ArrayShuffle(this.trips, event.previousIndex, event.currentIndex);
        moveItemInArray(this.trips, event.previousIndex, event.currentIndex);
    }

    async ArrayShuffle(array, previousIndex, currentIndex) {
        var prevValOnIndex = array[previousIndex];
        var newArr = [];
        var j=0;
        for(const i of array){
            if((currentIndex) === j){
                await newArr.push(prevValOnIndex)
                j=j+1;
            } else{
                await newArr.push(array[j]);
                j=j+1;
            }
            
            // console.log(newArr);
            if(i == array.length-1){
                this.trips = newArr;
                // console.log(this.trips);
            }   
        }
    }

    addRow(){
        var addObj = {
            type: '',
            date: '',
            name: '',
            location: '',
            miles: '',
            truck: '',
            trailer: '',
            driver: '',
            coDriver: '',
            carrier: '',
        };
        
        addObj.type = $('#cell1').val();
        addObj.date = $('#cell2').val();
        addObj.name = $('#cell3').val();
        addObj.location = $('#cell4').val();
        addObj.miles = $('#cell5').val();
        addObj.truck = $('#cell6').val();
        addObj.trailer = $('#cell07').val();
        addObj.driver = $('#cell8').val();
        addObj.coDriver = $('#cell9').val();
        addObj.carrier = $('#cell10').val();
        
        if(addObj.type != '' && addObj.date != '' &&  addObj.name != '' && addObj.location != '' && addObj.miles != ''){
            $('.newRow').val('');
            this.trips.push(addObj);
        } else{
            return false;
        }
        
    }

    delRow(index){
        this.trips.splice(index, 1);
    }
    
    showEditRow(index){
        $(".labelRow"+index).css('display','none');
        $(".editRow"+index).css('display','');
    }

    editRow(index){
        this.trips[index].type = $('#editCell1'+index).val();
        this.trips[index].date = $('#editCell2'+index).val();
        this.trips[index].name = $('#editCell3'+index).val();
        this.trips[index].location = $('#editCell4'+index).val();
        this.trips[index].miles = $('#editCell5'+index).val();
        this.trips[index].truck = $('#editCell6'+index).val();
        this.trips[index].trailer = $('#editCell07'+index).val();
        this.trips[index].driver = $('#editCell8'+index).val();
        this.trips[index].coDriver = $('#editCell9'+index).val();
        this.trips[index].carrier = $('#editCell10'+index).val();

        $("#labelCell1"+index).val(this.trips[index].type);
        $("#labelCell2"+index).val(this.trips[index].date);
        $("#labelCell3"+index).val(this.trips[index].name);
        $("#labelCell4"+index).val(this.trips[index].location);
        $("#labelCell5"+index).val(this.trips[index].miles);
        $("#labelCell6"+index).val(this.trips[index].truck);
        $("#labelCell7"+index).val(this.trips[index].trailer);
        $("#labelCell8"+index).val(this.trips[index].driver);
        $("#labelCell9"+index).val(this.trips[index].coDriver);
        $("#labelCell10"+index).val(this.trips[index].carrier);
        
        $(".labelRow"+index).css('display','');
        $(".editRow"+index).css('display','none');
    }

    closeEditRow(index){ 
        $(".labelRow"+index).css('display','');
        $(".editRow"+index).css('display','none');   
    }
}
