import { LightningElement,track} from 'lwc';
// import server side apex class method 
import getAssets from '@salesforce/apex/AssetAssistantCtl.getAssets';

import addFloorPlanDealer from '@salesforce/apex/AssetAssistantCtl.addFloorPlanDealer';
import removeDamaged from '@salesforce/apex/AssetAssistantCtl.removeDamaged';
import removeShortage from '@salesforce/apex/AssetAssistantCtl.removeShortage';
import removeStolen from '@salesforce/apex/AssetAssistantCtl.removeStolen';
import removeTransfered from '@salesforce/apex/AssetAssistantCtl.removeTransfered'
// import standard toast event 
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
const actions = [
    { label: 'Add Asset', name: 'Add Asset',  },
    { label: 'Remove Damaged', name: 'Remove Damaged' },
    { label: 'Remove Shortage', name: 'Remove Shortage'},
    {label: 'Remove Stolen', name: 'Remove Stolen' },
    {label: 'Transfer', name: 'Transfer' },
];
const columns = [
    { fieldName: 'Id', fixedWidth: 1 },
    { label: 'Serial Number', fieldName: 'Serial_Number_Link__c',type: 'url' , typeAttributes: {label: { fieldName: 'SerialNumber' },target: '_blank'} },
    { label: 'Factory Model Number', fieldName: 'Factory_Model_Number__c' },
    { label: 'Model Number', fieldName: 'Model_Number__c' },
    { label: 'Consumer Name', fieldName: 'Consumer_Name__c',type: 'text' },
    { label: 'Floorplan Dealer Account', fieldName: 'Floorplan_Dealer_Entity_ID__c' },
    { label: 'Sold Date', fieldName: 'Sold_Date__c' },
    { label: 'Created Date', fieldName: 'CreatedDate', type:'date-local' },
    { label: 'Status', fieldName: 'Status' },
    { label: 'Registration Status', fieldName: 'Registration_Status_Link__c',type: 'url' ,typeAttributes: {label: 'Registered', target: '_blank'} }, 
    { label: 'Recent Action', fieldName: 'Recent_Action__c' },
    {
        type: 'action', 
        typeAttributes: { rowActions: actions  },
    },
   
];


export default class AssetAssistant extends LightningElement {
    
    @track contactsRecord;
    isModalOpen = false;
    isModalTransferOpen = false;
    ///@track isFooterOpen = false;
    //@track acEntity;
    @track searchValue = '';
    
    //value = '';
    error;
    columns = columns; // the variable columns is never changed hence the page id not rerendered maybe?
    assetId = '';
     
    // update searchValue var when input field value change
    searchKeyword(event) {
        this.searchValue = event.target.value;
    }
 
    // call apex method on button click 
    handleSearchKeyword() {
        console.log('search logic-start ');
        if (this.searchValue !== '') {
        console.log('search logic-inside if ');
            getAssets({
                    searchKey: this.searchValue
                })
                .then(result => {
                    // set @track contacts variable with return contact list from server  
                    this.contactsRecord = result;
                    //console.log(contactsRecord);
                    console.log('here1');
                    //console.log(contactsRecord[0].Contact.FirstName);
                    
                })
                .catch(error => {
                   
                    const event = new ShowToastEvent({
                        title: 'Error',
                        variant: 'error',
                        message: error.body.message,
                    });
                    //console.log(contactsRecord)
                    this.dispatchEvent(event);
                    // reset contacts var with null   
                    this.contactsRecord = null;
                });
        } else {
            console.log('search logic-inside else ');
            // fire toast event if input field is blank
            const event = new ShowToastEvent({
                variant: 'error',
                message: 'Search text missing..',
            });
            this.dispatchEvent(event);
        }
    }
   /* get options() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
    }*/
    handleRowActions(event) {
        //console.log('Before the if ' + event.detail.action.Id);
        console.log('xxx-ID '+event.detail.row.Id);
        this.assetId = event.detail.row.Id;
        if(event.detail.action.name == 'Add Asset' ){
            this.isModalOpen = true;
            console.log('in the if');
           
            //var recordIndex = this.template.querySelector('lightning-datatable').selectedRows;
           // console.log('record!!! '+recordIndex);
        }

       else if(event.detail.action.name == 'Remove Damaged' ){
            this.handleRemoveDamaged(this.assetId);
            console.log('in the remove if');
            
        }

       else if(event.detail.action.name == 'Remove Shortage' ){
            this.handleRemoveShortage(this.assetId);
            console.log('in the remove if');
            
        }

        else if(event.detail.action.name == 'Remove Stolen' ){
            this.handleRemoveStolen(this.assetId);
            console.log('in the remove if');
            
        }

        else if(event.detail.action.name == 'Transfer' ){
            this.isModalTransferOpen = true;
            
            
        }

      
        
    }

    closeModal() {
      
        this.isModalOpen = false;
    }

    closeTransferModal() {
      
        this.isModalTransferOpen = false;
    }
    addDealer() {
     
        var inp=this.template.querySelector('lightning-input[data-name="input1"]').value;
      
        console.log("xxx-inp-" + inp);

         var acEntity = inp;
        
        //console.log('xxx-acEntity-'+acEntity);
        //console.log('xxx-sfAssetFloorPlanIDBefore-'+this.contactsRecord[0]);
        //var sfAsset = this.contactsRecord[0].Id;
        var sfAsset = this.assetId;
        console.log('xxx-sfAsset-'+sfAsset);
        if(inp != ''){
        addFloorPlanDealer({
            sfAssetId: sfAsset,
            dealerId: acEntity
        }).then(result => {
            // set @track contacts variable with return contact list from server  
            //this.contactsRecord = result;
            //console.log(contactsRecord);
            console.log('her2e');
           

            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: 'Sucessfully added Asset',
            }));
            //co
            //console.log(contactsRecord[0].Contact.FirstName);
            
        }).catch(error => {
           
            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: error.body.message,
            });
            //console.log(contactsRecord)
            this.dispatchEvent(event);
            // reset contacts var with null   
           // this.contactsRecord = null;
        });
    }else{
        
        console.log('search logic-inside else ');
        // fire toast event if input field is blank
        const event = new ShowToastEvent({
            variant: 'error',
            message: 'Search text missing..',
        });
        this.dispatchEvent(event);
        
    }
       // addFloorPlanDealer(sfAssetID,acEntity);

        console.log('xxx-sfAssetIDFloorPlan-'+this.contactsRecord[0].Floorplan_Dealer_Account__c );
        this.isModalOpen = false;
    }
   
    handleRemoveDamaged(removeSAsset){
        //this.isFooterOpen = false;  
        console.log('in the remove now');
        var sfAsset = removeSAsset;
        console.log(sfAsset);

            removeDamaged({
                sfAssetId: sfAsset
               
            }).then(result => {
                // set @track contacts variable with return contact list from server  
              
                //console.log(contactsRecord);
                
               
    
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success!!',
                    message: 'Sucessfully removed Damaged Asset',
                }));
                //co
                //console.log(contactsRecord[0].Contact.FirstName);
                
            }).catch(error => {
               
                const event = new ShowToastEvent({
                    title: 'Error',
                    variant: 'error',
                    message: error.body.message,
                });
                //console.log(contactsRecord)
                this.dispatchEvent(event);
                // reset contacts var with null   
               // this.contactsRecord = null;
            });
        
     
    }

    handleRemoveShortage(removeSAsset){
        //this.isFooterOpen = false;  
        console.log('in the remove now');
        var sfAsset = removeSAsset;
        console.log(sfAsset);

            removeShortage({
                sfAssetId: sfAsset
               
            }).then(result => {
                // set @track contacts variable with return contact list from server  
              
                //console.log(contactsRecord);
                
               
    
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success!!',
                    message: 'Sucessfully removed Shortage Asset',
                }));
                //co
                //console.log(contactsRecord[0].Contact.FirstName);
                
            }).catch(error => {
               
                const event = new ShowToastEvent({
                    title: 'Error',
                    variant: 'error',
                    message: error.body.message,
                });
                //console.log(contactsRecord)
                this.dispatchEvent(event);
                // reset contacts var with null   
               // this.contactsRecord = null;
            });
        
     
    }

    
    handleRemoveStolen(removeSAsset){
        //this.isFooterOpen = false;  
        console.log('in the remove now');
        var sfAsset = removeSAsset;
        console.log(sfAsset);

            removeStolen({
                sfAssetId: sfAsset
               
            }).then(result => {
                // set @track contacts variable with return contact list from server  
              
                //console.log(contactsRecord);
                
               
    
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success!!',
                    message: 'Sucessfully removed Stolen Asset',
                }));
                //co
                //console.log(contactsRecord[0].Contact.FirstName);
                
            }).catch(error => {
               
                const event = new ShowToastEvent({
                    title: 'Error',
                    variant: 'error',
                    message: error.body.message,
                });
                //console.log(contactsRecord)
                this.dispatchEvent(event);
                // reset contacts var with null   
               // this.contactsRecord = null;
            });
        
     
    }

    transferDealer() {
     
        var inp=this.template.querySelector('lightning-input[data-name="input2"]').value;
      
        console.log("xxx-inp-" + inp);

         var acEntity = inp;
        
        //console.log('xxx-acEntity-'+acEntity);
        //console.log('xxx-sfAssetFloorPlanIDBefore-'+this.contactsRecord[0]);
        //var sfAsset = this.contactsRecord[0].Id;
        var sfAsset = this.assetId;
        console.log('xxx-sfAsset-'+sfAsset);
        if(inp!=''){
        removeTransfered({
            sfAssetId: sfAsset,
            dealerId: acEntity
        }).then(result => {
            // set @track contacts variable with return contact list from server  
            //this.contactsRecord = result;
            //console.log(contactsRecord);
            console.log('her2e');
           

            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: 'Sucessfully Transfered Asset',
            }));
            //co
            //console.log(contactsRecord[0].Contact.FirstName);
            
        }).catch(error => {
           
            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: error.body.message,
            });
            //console.log(contactsRecord)
            this.dispatchEvent(event);
            // reset contacts var with null   
           // this.contactsRecord = null;
        });
    }else{

        console.log('search logic-inside else ');
        // fire toast event if input field is blank
        const event = new ShowToastEvent({
            variant: 'error',
            message: 'Search text missing..',
        });
        this.dispatchEvent(event);

    }
       // addFloorPlanDealer(sfAssetID,acEntity);

        console.log('xxx-sfAssetIDFloorPlan-'+this.contactsRecord[0].Floorplan_Dealer_Account__c );
        this.isModalTransferOpen = false;
    }
   

   
}