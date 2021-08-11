public with sharing class AssetAssistantCtl {
     @AuraEnabled(cacheable=false) // ToFuture: Jaiy felt cachable should be true ? any advantages.
    public static list<Asset> getAssets(string searchKey) {
        searchKey =searchKey.trim();
        string searchKeyword = '%' + searchKey + '%';
		
        // create contact list to store search result 
         list<Asset> assetRecord = new list<Asset>(); // assetRecord should be plural
        
       
        if(searchKey != NULL){

            for(Asset obj : [Select ID
                                ,Serial_Number_Link__c, CreatedDate, ContactId, Consumer_Name__c,Registration_Status_Link__c,SerialNumber
                                ,Factory_Model_Number__c,Model_Number__c,Floorplan_Dealer_Entity_ID__c, Sold_Date__c, Status,Recent_Action__c  
                                From Asset WHERE SerialNumber LIKE: searchKeyword]){
                //String temp = obj.SerialNumber;
                //obj.SerialNumber = 'https://mtdproducts--devjaiy.lightning.force.com/lightning/r/Asset/'+temp;
                //system.debug('xxx-temp:'+obj.SerialNumber);
                assetRecord.add(obj);
               
            }

        }

        
         if(assetRecord.size() == 0){
            throw new AuraHandledException('No Record Found..'); 
         }
         
        return assetRecord;
    }

    @AuraEnabled(cacheable=false)
    public static void addFloorPlanDealer(ID sfAssetId, String dealerId) {
        system.debug('xxx-sfAssetId:'+sfAssetId);
        system.debug('xxx-dealerId:'+dealerId);

        dealerId = dealerId.trim();
          list<Account> sfAccountId = [Select ID, Entity_ID__c
                         From Account WHERE Entity_ID__c =: dealerId];
        system.debug('xxx-account:'+sfAccountId[0].ID);
        

        system.debug('xxx-Entity_ID__c:'+sfAccountId[0].Entity_ID__c);
        list<Asset> AssetId = [Select ID 
                         From Asset WHERE ID =: sfAssetId];
        system.debug('xxx-assetBefore:'+AssetId);
        
        Asset a = AssetId.get(0);
        
        a.Floorplan_Dealer_Account__c = sfAccountId.get(0).ID;
        update a;
          
	  	system.debug('xxx-assetAfter:'+AssetId);   
          
         
    }
    @AuraEnabled(cacheable=false)
    public static void removeDamaged(ID sfAssetId) {
        //set the special picklist field 
        //remove the value from the floor plan foreign key. 
        list<Asset> AssetId = [Select ID, Floorplan_Dealer_Account__c 
                         From Asset WHERE ID =: sfAssetId];
        system.debug('xxx-assetBefore:'+AssetId.get(0).Floorplan_Dealer_Account__c);
        Asset a = AssetId.get(0);
        a.Recent_Action__c = 'Damaged';
        a.Floorplan_Dealer_Account__c = NULL;
        update a;
        system.debug('xxx-assetAfter:'+AssetId.get(0).Floorplan_Dealer_Account__c);   
        
          
    }

    @AuraEnabled(cacheable=false)
    public static void removeShortage(ID sfAssetId) {
        //set the special picklist field 
        //remove the value from the floor plan foreign key. 
        list<Asset> AssetId = [Select ID, Floorplan_Dealer_Account__c 
                         From Asset WHERE ID =: sfAssetId];
        system.debug('xxx-assetBefore:'+AssetId.get(0).Floorplan_Dealer_Account__c);
        Asset a = AssetId.get(0);
        a.Recent_Action__c = 'Shortage';
        a.Floorplan_Dealer_Account__c = NULL;
        update a;
        system.debug('xxx-assetAfter:'+AssetId.get(0).Floorplan_Dealer_Account__c);   
        
          
    }

    @AuraEnabled(cacheable=false)
    public static void removeStolen(ID sfAssetId) {
        //set the special picklist field 
        //remove the value from the floor plan foreign key. 
        list<Asset> AssetId = [Select ID, Floorplan_Dealer_Account__c 
                         From Asset WHERE ID =: sfAssetId];
        system.debug('xxx-assetBefore:'+AssetId.get(0).Floorplan_Dealer_Account__c);
        Asset a = AssetId.get(0);
        a.Recent_Action__c = 'Stolen';
        a.Floorplan_Dealer_Account__c = NULL;
        update a;
        system.debug('xxx-assetAfter:'+AssetId.get(0).Floorplan_Dealer_Account__c);   
        
          
    }
    @AuraEnabled(cacheable=false)
    public static void removeTransfered(ID sfAssetId,String dealerId) {
        //set the special picklist field 
       //change the value from the floorplan dealer to the new dealer.
       dealerId = dealerId.trim();
             list<Account> sfAccountId = [Select ID, Entity_ID__c
                        From Account WHERE Entity_ID__c =: dealerId];
       system.debug('xxx-account:'+sfAccountId);
       
       list<Asset> AssetId = [Select ID 
                        From Asset WHERE ID =: sfAssetId];
       system.debug('xxx-assetBefore:'+AssetId);
       
       Asset a = AssetId.get(0);
       
       a.Recent_Action__c = 'Transferred';
       a.Floorplan_Dealer_Account__c = sfAccountId.get(0).ID;
       update a;
       system.debug('xxx-assetAfter:'+AssetId); 
   }
}
