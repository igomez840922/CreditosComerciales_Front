
export default class LocalStorageHelper{

    save(name,value) {
        try{
    
            value = JSON.stringify(value);
            localStorage.setItem(name,value );
            console.log("localStorage", localStorage.getItem(name));
          return true;
        }
        catch(err){console.error(err);}
        return false;
    }

    get(name) {
        try{    
            var result = localStorage.getItem(name);
            result = JSON.parse(result);        
            return result;
        }
        catch(err){console.error(err);}
        return null;
    }

    delete(name) {
        try{    
            localStorage.removeItem(name);
            return true;
        }
        catch(err){console.error(err);}
        return false;
    }

    clear() {
        try{    
            localStorage.clear();
            return true;
        }
        catch(err){console.error(err);}
        return false;
    }
}