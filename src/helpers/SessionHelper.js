
export default class SessionHelper{

    save(name,value) {
        try{
    
            value = JSON.stringify(value);
            sessionStorage.setItem(name,value );
        
          return true;
        }
        catch(err){console.error(err);}
        return false;
    }

    get(name) {
        try{    
            var result = sessionStorage.getItem(name);
            result = JSON.parse(result);        
            return result;
        }
        catch(err){console.error(err);}
        return null;
    }

    delete(name) {
        try{    
            sessionStorage.removeItem(name);
            return true;
        }
        catch(err){console.error(err);}
        return false;
    }

    clear() {
        try{    
            sessionStorage.clear();
            return true;
        }
        catch(err){console.error(err);}
        return false;
    }
}