export const monthlyFolder = async () =>{
    const d = new Date();
    const m = d.getMonth() + 1;
   
    const folder = await m.toString() + d.getFullYear().toString();
    return folder;
    // throw new ReferenceError("error generated");
   }

export const getSection = async (string,section) => {
    const last_pos =  string.lastIndexOf('/');
    var str_section = ''
    switch(section){
        case 'path': 
            str_section = await string.substring(0, last_pos + 1);
            break;
        case 'image':
            str_section = await string.substring(last_pos + 1);
            break;
    }

    return str_section;
}

export const getTimestamp = async() => {
    var myDate = new Date();
    var offset = myDate.getTimezoneOffset() * 60 * 1000;
  
    var withOffset = myDate.getTime();
    var withoutOffset = withOffset - offset;
    return offset;
  }