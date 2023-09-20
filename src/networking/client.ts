import axios from "axios";

export class CharleeClient{
    key : string;
    host : string;
    spaceId : string;
    baseUrl : string
    constructor(key : string, host : string, spaceId : string){
        this.key = key;
        this.host = host;
        this.spaceId = spaceId;
        if(!host.toLowerCase().startsWith("http://") && !host.toLowerCase().startsWith("https://")){
            this.baseUrl = `https://${host}/`
        }else{
            this.baseUrl = `${host}/`
        }
    }

    async post<T = any>(path : string, data : any){
        const resp = await axios.post<T>(`${this.baseUrl}/api/space/${this.spaceId}${path}`, data, {
            headers : {
                Authorization : `Bearer ${this.key}`
            }
        })
        return resp;
    }
    async put<T = any>(path : string, data : any){
        const resp = await axios.put<T>(`${this.baseUrl}/api/space/${this.spaceId}${path}`, data, {
            headers : {
                Authorization : `Bearer ${this.key}`
            }
        })
        return resp.data 
    }    
    async get<T = any>(path : string){
        const resp = await axios.get<T>(`${this.baseUrl}/api/space/${this.spaceId}${path}`,{
            headers : {
                Authorization : `Bearer ${this.key}`
            }
        })
        return resp.data 
    }    
    async delete<T = any>(path : string){
        const resp = await axios.delete<T>(`${this.baseUrl}/api/space/${this.spaceId}${path}`,{
            headers : {
                Authorization : `Bearer ${this.key}`
            }
        })
        return resp.data 
    }        
}