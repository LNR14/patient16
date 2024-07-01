import { Component, OnInit, inject } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AgChartOptions } from 'ag-charts-community';
import { getGridData,getChartData} from "./getData";
import { NgbCalendar, NgbDateStruct,NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'patient16';
  public chartOptions: any
  loading:boolean = true
  showChart:boolean = true
  getGridData = getGridData();
  getChartData = getChartData();
  locationsDropDown:any = [];
  fromDate:NgbDateStruct = {} as any
  toDate:NgbDateStruct = {} as any
  date: { year: number; month: number } = {} as any;
  today = inject(NgbCalendar).getToday();
  locations = [] as any
  d = new Date("2024-03-25");
  rowData:any
  // locatio
	
  
  series:any
  ngOnInit():void {
    const locationsSet =  new Set();
    getChartData().forEach((item: { location: string; revenue: string; date: string | number | Date; }) => {
      locationsSet.add(item.location);
    })
    this.locationsDropDown = Array.from(locationsSet)
    this.displayGridData(getGridData())
    this.loading = false
    console.log(this.locationsDropDown)
    // this.convertDataSet(getChartData())
  }
  
  constructor(){
    
    this.chartOptions = {
      title: {
        text: "Revenue for each location",
      },
      // Data: Data to be displayed in the chart
      series: this.convertDataSet(getChartData()),
    axes: [
      {
        type: "time",
        position: "bottom",
      },
      {
        type:"number",
        position:"left",
        label: {
          format: "#{.2f} $",
        },
      }
    ],
    };
  }

  convertDataSet = (data:any) => {
    const groupedData = {} as any;
    const locationsSet =  new Set();
      
    // Group data by location
    data.forEach((item: { location: string; revenue: string; date: string | number | Date; }) => {
      locationsSet.add(item.location);
      const location = item.location;
      const revenue = parseFloat(item.revenue.replace(/[^0-9.-]+/g,"")); 
      const date = new Date(item.date);
  
      if (!groupedData[location]) {
        groupedData[location] = [];
      }
  
      groupedData[location].push({
        time: date,
        revenue: revenue
      });
    });

    Object.keys(groupedData).forEach(location => {
      groupedData[location].sort((a:any, b:any) => a.time - b.time);
    });
  
    // Convert grouped data into desired format
    const result = Object.keys(groupedData).map(location => ({
      data: groupedData[location],
      xKey: "time",
      yKey: "revenue",
      yName: location
    }));
    console.log(result)
    // this.chartOptions.series = result
    return result;
  }

  colDefs: ColDef[] = [
    { headerName: "Patient Firstname", field:'firstName' } ,
    { headerName: "patient lastName",  field:'lastName' },
    { headerName: "Transaction Date" , field:'transactionData'},
    { headerName: "Patient MRN" , field:'MRN'},
    { headerName : "Encounter#",  field:'encounterNumber'},
    { headerName : "Date of birth", field:'dateOfBirth'},
  ];

  filterData(){
    console.log(this.locations)
    if(this.locations.includes("All")){
      console.log("all")
      const result = this.convertDataSet(getChartData())
      this.chartOptions = {
        ...this.chartOptions,
        series: result ,
      };
      this.displayGridData(getGridData())
    } else{
      const filterChartData = this.getChartData.filter((item) =>{
         return this.locations.includes(item.location)
      })
      const result = this.convertDataSet(filterChartData) 
      this.chartOptions = {
        ...this.chartOptions,
        series: result ,
      };
      const filterGridData = this.getGridData.filter((item) =>{
        return this.locations.includes(item.location)
      })
      this.displayGridData(filterGridData)
    }

    
  }


    displayGridData = (data:any) => {
      this.rowData = data.map((patient: { firstName: String; lastName: String; transactionDate: any; MRN: any; encounterNumber: any; DateOfBirth: any; },index: any) =>{
        return{
          firstName : patient.firstName,
          lastName: patient.lastName,
          transactionData: patient.transactionDate,
          MRN:patient.MRN,
          encounterNumber:patient.encounterNumber,
          dateOfBirth:patient.DateOfBirth
        }
      })

    }
  }
