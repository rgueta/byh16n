export const monthlyFolder = async () =>{
    const d = new Date();
    const m = d.getMonth() + 1;
   
    const folder = await m.toString() + d.getFullYear().toString();
    return folder;
    // throw new ReferenceError("error generated");
   }