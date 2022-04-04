import Roles from '../models/Roles';

export const createRoles = async() => {
    const count = await Roles.estimatedDocumentCount();
    if(count > 0) return;

    try {
        const values = await Promise.all([
            new Roles({name:'admin'}).save(),
            new Roles({name:'supervisor'}).save(),
            new Roles({name:'neighbor'}).save(),
            new Roles({name:'relative'}).save(),
            new Roles({name:'provider'}).save(),
            new Roles({name:'visitor'}).save(),
    
        ]);

        console.log(values);

    } catch (error) {
        console.error(error)
    }

   
    new Roles
}