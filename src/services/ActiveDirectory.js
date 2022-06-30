import { authenticate } from "ldap-authentication"
/*
    Dominio: panama.banesco.lac
    Puerto: 389
    IP: 10.1.2.146
    usr:usrcredcomercial
    psw:gIwn$4dAuuJ8
*/

export default class ActiveDirectory {
   
    
  async login(username, password) {

    console.log("login");
    let authenticated = await authenticate({
        ldapOpts: { url: 'ldap://panama.banesco.lac' },
        userDn: 'uid=usrcredcomercial,dc=example,dc=com',
        userPassword: 'gIwn$4dAuuJ8',
      })

      console.log("login",authenticated);

    /*
        const ActiveDirectory = require('activedirectory2');
        const config = { url: 'ldap://panama.banesco.lac:389',
               baseDN: 'dc=banesco,dc=lac',
               username: 'usrcredcomercial',
               password: 'gIwn$4dAuuJ8' };
        const ad = new ActiveDirectory(config);

        ad.authenticate(username, password, function(err, auth) {
            if (err) {
              console.log('ERROR: '+JSON.stringify(err));
              return;
            }
           
            if (auth) {
              console.log('Authenticated!');
            }
            else {
              console.log('Authentication failed!');
            }
          });
          */
  }

  

}

