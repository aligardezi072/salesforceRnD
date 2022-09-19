import { LightningElement,track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountSearch.getAccounts';

export default class CustomSearch extends LightningElement {
        @track key;
        @track accounts;
        updateKey(event){
            this.key = event.target.value;
        }
        handleSearch(){

            getAccounts({searchkey: this.key})
            .then(result=>{
                this.accounts=result;

            })
            .catch(error=>{
                this.accounts = null;  
            });
                 
        }
        cols= [
            {label:'Account Name' , fieldName:'Name', type:'text'},
            {label:'Industry' , fieldName:'Industry', type:'text'},
            {label:'Phone' , fieldName:'Phone', type:'text'},
    
    ];
        
} 