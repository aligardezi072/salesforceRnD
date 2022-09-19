import { LightningElement,api,track,wire } from 'lwc';
import getChildDetails from '@salesforce/apex/GetContactOpportunityDetails.getChildDetails';


const columns1=[
    
    {label:'Oppurtunity Id',fieldName:'Id'},
    {label:'Oppurtunity Name',fieldName:'Name'},
];

const columns2=[
    {label:'Contact Id', fieldName:'Id'},
    {label:'Contact Name', fieldName:'Name'},
];


export default class RelatedListOfChildObject extends LightningElement {


    @api buttonLable="Show";
    @track oppurtunityData =[];
    @track contactData=[];

  
     columns1=columns1;
     columns2=columns2;

    @api recordId;
    @api showDatatable=false;
    

     oppurtunityTempArray=[];
     contactTempArray=[];
     

     
//Button event for show and hide
    
  handleShow(event){
        if(event.target.label=="Show"){
            this.buttonLable="Hide";
            this.showDatatable = true;
        }
        else if(event.target.label=="Hide"){
            this.buttonLable="Show";
            this.showDatatable = false;
        }
    }
    connectedCallback(){

        getChildDetails({ recId : this.recordId})
        .then ( res =>{
            let tempRecords=res;
            console.log("tempRecords:" + JSON.stringify(tempRecords));

            //create two object for storing Opportunities and contacts details.
            let temp =tempRecords.map(row =>{
                return Object.assign({ OppName : row.Opportunities , ContactName : row.Contacts  })
            })
            console.log("temp >>:" + JSON.stringify(temp))

            temp.forEach(element => {
                this.oppurtunityTempArray = element.OppName;
                console.log("oppurtunityTempArray:" + JSON.stringify(this.oppurtunityTempArray));

                this.contactTempArray = element.ContactName;
                console.log("ContactName" + JSON.stringify(this.contactTempArray));
            });

            this.oppurtunityData = this.oppurtunityTempArray;
            this.contactData = this.contactTempArray; 
        })
        .catch(error => {
            console.error("Error:" + JSON.stringify(error)); 
        }) 

    }
}
    