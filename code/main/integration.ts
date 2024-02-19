import Ajv from "ajv/dist/2020";
import { Process } from "./model/process";

let ajv = new Ajv({
    allErrors: true,
    parseDate: true,
});

ajv.addSchema({
    $id: "lookup",
    type: "object",
    properties: {
      bucket: { type: "string" },
      folder: { type: "string" },
    },
    required: ["bucket", "folder"],
});

let schemaProcess = {
    type: "object",
    properties: {
        ident: {type: 'string'},
        run: {type: 'string'},      
        lookup: {
            type: "array", 
            items: {
                type: "object",
                properties: {
                    bucket: { type: "string" },
                    folder: { type: "string" }
                }
            }
        },
        ignoreList: { 
            type: "array", 
            items: {type: "string"} 
        },
        numOfDays: {type: "number"}
    },
    required: ["run", "ident", "lookup", "ignoreList", "numOfDays"],
};  

const processValidator = ajv.compile<Process>(schemaProcess);

export const readProcess = (data: any): Process => {
  
  if(!processValidator(data) || processValidator.errors) {
    throw Error(
      (processValidator.errors ?? []).map(error => error.message ?? "no message").join(",")
    )
  }
  
  return {
    ...(data as Process),
  } as Process;
}

export const writeProcess = (process: Process): Process => {
    return {
      ...process,
    }
}