export declare function createCommsHandler(options?:{
 mode?:string;token?:string;tenantId?:string;readEnabled?:boolean;
 env?:(key:string)=>string|undefined;fetcher?:typeof fetch;
}):(request:Request)=>Promise<Response>;
