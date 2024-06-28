import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AgChartOptions } from 'ag-charts-community';
import { getGridData,getChartData,getLoungeData, getOfficeData } from "./getData";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'patient16';
  public chartOptions: AgChartOptions
  loading:boolean = true
  getGridData = getGridData();
  getChartData = getChartData();
  
  series:any
  ngOnInit():void {
    this.rowData = this.getGridData.map((patient,index) =>{
      return{
        firstName : patient.firstName,
        lastName: patient.lastName,
        transactionData: patient.transactionDate,
        MRN:patient.MRN,
        encounterNumber:patient.encounterNumber,
        dateOfBirth:patient.DateOfBirth
      }
    })
    this.loading = false
  }
  
  constructor(){
    this.chartOptions = {
      title: {
        text: "Revenue for each location",
      },
      // Data: Data to be displayed in the chart
      series: this.convertDataSet(),
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

  convertDataSet = (data = getChartData()) => {
    const groupedData = {} as any;
  
    // Group data by location
    data.forEach(item => {
      const location = item.location;
      const revenue = parseFloat(item.revenue.replace(/[^0-9.-]+/g,"")); // Convert revenue to number
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
  
    return result;
  }

  rowData:any

  colDefs: ColDef[] = [
    { headerName: "Patient Firstname", field:'firstName' } ,
    { headerName: "patient lastName",  field:'lastName' },
    { headerName: "Transaction Date" , field:'transactionData'},
    { headerName: "Patient MRN" , field:'MRN'},
    { headerName : "Encounter#",  field:'encounterNumber'},
    { headerName : "Date of birth", field:'dateOfBirth'},
  ];
}
