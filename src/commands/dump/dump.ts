    import { log } from "../../utils/log";
import { CharleeClient } from "../../networking/client";
import fs from "fs"
export async function dump(host : string, spaceId : string, key : string, path : string){
    const client = new CharleeClient(key, host, spaceId);

    if(!fs.existsSync(`${path}`)){
        fs.mkdirSync(`${path}`)
    }

    await dumpEntities("contenttype", "contentTypeId", "contenttypes", client, path)
    await dumpEntities("folder", "folderId", "folders", client, path)
    await dumpEntities("content", "contentId", "items", client, path)
    await dumpEntities("webhook", "webookId", "webhooks", client, path)
}


async function dumpEntities(entity : string, entityIdProperty : string, responseListingProperty : string, client : CharleeClient, path : string){

    log(`Dumping ${entity}s`)

    let entitiesToDump = []
 
        log(`   Listing ${entity}s`)
        const resp = await client.get<any>(`/${entity}`)
        entitiesToDump = [...resp[responseListingProperty].map(p=>p[entityIdProperty])]
        log(`      Found ${entitiesToDump.length} ${entity}s`)

    if(!fs.existsSync(`${path}/${entity}`)){
        fs.mkdirSync(`${path}/${entity}`)
    }

    if(entity === "folder"){
        for(const folder of resp.folders){
            fs.writeFileSync(`${path}/${entity}/${folder.folderId}.json`, JSON.stringify(folder, null, 3))
        }
    }else{
        for(const entityId of entitiesToDump){
            await dumpEntity(client, entity, entityId, path)
        }
    
    }

}

async function dumpEntity(client : CharleeClient, entity : string, entityId : string,  path : string){
    log(`   Fetching ${entityId}`)
    try{
        const resp = await client.get(`/${entity}/${entityId}`)
        
        fs.writeFileSync(`${path}/${entity}/${entityId}.json`, JSON.stringify(resp, null, 3))
    
    }catch(ex){
        console.log(ex)
        log(`      Faild to fetch ${entity}`)
    }
}


