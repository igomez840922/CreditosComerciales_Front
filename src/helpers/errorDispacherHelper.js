

import LocalStorageHelper from "./LocalStorageHelper";

export default class errorDispacherHelper{

    static dispatch(errorData) {
        try{            
            var localStorageHelper = new LocalStorageHelper();
            localStorageHelper.save("generalError",errorData);
            const event = new CustomEvent('generalError', errorData);
            event.initEvent("generalError", true, true);
            window.dispatchEvent(event);
        }
        catch(err){}
    }
}
