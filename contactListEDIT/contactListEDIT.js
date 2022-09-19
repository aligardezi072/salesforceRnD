import { LightningElement,track,wire,api} from 'lwc';
import getContactsLists from '@salesforce/apex/ContactsUpdate.getContactsLists';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex';




const columns = [ 
    
    {label: 'Name', fieldName: 'Name', editable:true},
    {label: 'Email', fieldName: 'Email', type: 'email', editable:true},
    {label: 'Phone', fieldName: 'Phone', type: 'phone', editable:true},
];
export default class ContactListEDIT extends LightningElement {

    @track columns = columns;
    @track contacts;
    @track draftValues = [];
    @api recordId;
    @api searchKey;
    @wire(getContactsLists)
    cons(result){
        this.contacts=result;
        if(result.error){
            this.contact = undefined;
        }
    };

    connectedCallback(){
        getContactsLists({lwcRecordId : this.recordId})
        .then(response =>{
            this.contacts= response;
        })
        .catch(err=>{
            console.log("Error occured:" +err);S
        })
    }

    handleChanged(event){
        this.searchKey = event.target.value;
        console.log("searchKey:" +JSON.stringify(this.searchKey))

        getContactsLists({searchKeys: this.searchKey, lwcRecordId : this.recordId})
        .then(res=>{
            this.contacts = res;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    async handleSave(event) {
        this.draftValues=event.detail.draftValues;
        const record=this.draftValues.slice().map(draftvalue=>{
            const fields =Object.assign({},draftvalue);
            return { fields };
        });
        
        const promises=record.map(recordInput => updateRecord(recordInput)); 
        
        
        Promise.all(promises).then(res=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title:'Success',
                        message:'Records Updated Successfully',
                        variant:'success'
                    })
                );
                this.draftValues=[];
                return this.refresh();
            }).catch(error=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title:'Error',
                        message:'An Error Occured!!',
                        variant:'error'
                    })
                );
            }).finally(()=>{
                this.draftValues=[];
            });
            
        }
        async refresh(){
            await refreshApex(this.contacts);
    }
}
    





