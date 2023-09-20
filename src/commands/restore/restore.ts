import { CharleeClient } from "../../networking/client";
import { log } from "../../utils/log";
import fs from "fs";

export async function restore(host : string, spaceId : string, key : string, path : string){
    const client = new CharleeClient(key, host, spaceId);

    if(!fs.existsSync(`${path}`)){
        log(`Path not found: ${path}`)
        return;
    }

    const restoredContentTypes = await restoreContentTypes(client, path)
    const restoredFolders = await restoreFolders(client, path, restoredContentTypes)
    const restoredContentItems = await restoreContent(client, path, restoredContentTypes, restoredFolders);

    

}

async function restoreContentTypes(client : CharleeClient, path : string){
    let restored : { oldId : string, newId : string }[] = []
    if(!fs.existsSync(`${path}/contenttype`)) return restored

    log("Restoring contenttypes")
    const files = fs.readdirSync(`${path}/contenttype`)
    for(const file of files){
        const data = JSON.parse(fs.readFileSync(`${path}/contenttype/${file}`).toString())
        log(`   Restoring ${data.contentTypeId}`)
        try{
            let response = await client.post<{ contenttype : { contentTypeId : string}}>("/contenttype", {
                name : data.name,
                contentTypeId :  data.contentTypeId
            })
            await client.put(`/contenttype/${response.data.contenttype.contentTypeId}`,{
                name : data.name, 
                enabled : data.enabled,
                fields : data.fields,
                generateSlug : data.generateSlug,
                hidden : data.hidden
            } )
            restored.push({ oldId : data.contentTypeId, newId : response.data.contenttype.contentTypeId })
        }catch(ex){
            console.log(ex)
            log(`      Failed to restore`)
        }

    }
    return restored

}


async function restoreFolders(client : CharleeClient, path : string, restoredContentTypes : { oldId : string, newId : string }[] ){
    let restored : { oldId : string, newId : string }[] = []
    if(!fs.existsSync(`${path}/folder`)) return restored

    log("Restoring folders")
    const files = fs.readdirSync(`${path}/folder`)
    for(const file of files){
        const data = JSON.parse(fs.readFileSync(`${path}/folder/${file}`).toString())
        log(`   Restoring ${data.folderId}`)
        try{
            let response = await client.post<{  folderId : string}>("/folder", {
                name : data.name,
                folderId :  data.folderId
            })
            await client.put(`/folder/${response.data.folderId}`,{
                name : data.name, 
                contentTypes : data.contentTypes.map(c=>{
                    return restoredContentTypes.find(p=>p.oldId === c)?.newId ?? c
                    
                })
            } )
            restored.push({ oldId : data.folderId, newId : response.data.folderId })
        }catch(ex){
            console.log(ex)
            log(`      Failed to restore`)
        }

    }
    return restored

}


async function restoreContent(client : CharleeClient, path : string, restoredContentTypes : { oldId : string, newId : string }[],  restoredFolders : { oldId : string, newId : string }[] ){
    let restored : { oldId : string, newId : string }[] = []
    if(!fs.existsSync(`${path}/content`)) return restored

    log("Restoring content")
    const files = fs.readdirSync(`${path}/content`)
    for(const file of files){
        const data = JSON.parse(fs.readFileSync(`${path}/content/${file}`).toString())
        log(`   Restoring ${data.content.contentId}`)
        try{

            const newContentTypeId = restoredContentTypes.find(p=>p.oldId === data.content.contentTypeId)?.newId
            if(!newContentTypeId){
                log(`   Content Type not found ${data.content.contentTypeId}`)
                continue;
            }

            let payloadCreate :  { contentTypeId : string, folderId? : string, contentId : string}= {
                "contentTypeId": newContentTypeId,
                "contentId": data.content.contentId
            }
            let response = await client.post<{  contentId : string}>("/content", payloadCreate)


            let payloadUpdate : { status : string, folderId? : string, data : any} = {
                status : data.content.status,
                data : data.contentData
            }
            if(data.content.fodlerId){
                const newFolderId = restoredFolders.find(p=>p.oldId === data.content.folderId)?.newId 
                if(newFolderId){
                    payloadUpdate.folderId = newFolderId;
                }
            }
            await client.put(`/content/${response.data.contentId}`,payloadUpdate)

            restored.push({ oldId : data.folderId, newId : response.data.contentId })
        }catch(ex){
            console.log(ex)
            log(`      Failed to restore`)
        }

    }
    return restored

}