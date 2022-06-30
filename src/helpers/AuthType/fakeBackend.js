import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import * as url from "../url_helper"
import accessToken from "../jwt-token-access/accessToken"
import ApiServiceAuth from "../../services/ApiServiceAuth";
import BackendServices from "../../services/BackendServices/Services";
import toastr from "toastr";
import "toastr/build/toastr.min.css"

import LocalStorageHelper from "../../helpers/LocalStorageHelper";
import * as opt from "../../helpers/options_helper"

import {
  calenderTypeEvent,
  events,
  tasks,
} from "../../common/data"

let users = [
  {
    uid: 1,
    username: "admin",
    role: "admin",
    password: "123456",
    email: "admin@themesbrand.com",
  },
]

const fakeBackend = () => {
  // This sets the mock adap ter on the default instance
  const mock = new MockAdapter(axios)
  const localStorageHelper = new LocalStorageHelper();

  mock.onPost(url.POST_FAKE_REGISTER).reply(config => {
    const user = JSON.parse(config["data"])
    users.push(user)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, user])
      })
    })
  })

  mock.onPost("/post-fake-login").reply(async config => {

    const user = JSON.parse(config["data"])
    const usr = user.email
    const psw = user.password
    let email = user.email
    let isAnalysisSupervisor = false;
    let isAdmin = false;
    const auth = {
      headers: {
        username: usr,
        password: psw
      }
    }

    const header = {
      login: "ok",
      autorizatrion: "true"
    }

    let validatorLogin = false;
    let instancia = new ApiServiceAuth();

    const api = new BackendServices();
    var dataUser = await api.getUserInfo(usr, psw);
    if (dataUser !== undefined) {
      if (dataUser.status == 200) {
        if (dataUser.result !== null && dataUser.result !== undefined) {
          var menberof = dataUser.result.menberOf;
          email = dataUser.result.userprincipalName.split(':')[1].trim();
          isAnalysisSupervisor = menberof != null && (menberof.indexOf('CN=' + opt.Grp_SupervisorAnalisisCredito) >= 0) ? true : false;
          isAdmin = menberof != null && menberof.indexOf('CN=' + opt.Grp_Administrador) >= 0 ? true : false;
          console.log('dataUser', dataUser, email);
          if (menberof != null && menberof.indexOf('OU=RHPAM') >= 0) {
            await instancia.post(url.URL_BPM_LOGIN, {}, {}, auth).then(resp => {
              validatorLogin = resp.data.body != null && resp.data.body.Autentication == true ? true : false;
            }, reject => {
              var businessStatus = reject.response.data.businessStatus;
              if (businessStatus == 401) {
                toastr.error("El usuario no esta autorizado en el bussines central", 'Error!');
              } else {
                toastr.error(reject.response.data.message, 'Error!');
              }
              validatorLogin = false
            });
          } else {
            toastr.error("El usuario no esta configurado en los grupos para acceder a la aplicacion", 'Error!');
          }
        } else {
          toastr.error("Se ha presentado un error al obtener la informacion del usuario", 'Error!');
        }

      } else {
        toastr.error(dataUser.error.exceptionMessage, 'Error!');
      }
    }

    //validatorLogin = true;//Trampa para entrar
    if (validatorLogin === true) {
      // alert()

      if (validatorLogin === true) {
        localStorageHelper.save(opt.VARNAME_USRCREDENTIAL, { usr: usr, psw: psw, email: email, isAnalysisSupervisor: isAnalysisSupervisor, isAdmin: isAdmin, menberof });
      }

      return new Promise((resolve, reject) => {
        toastr.options = {
          positionClass: 'toast-top-right',
          closeButton: true,
          progressBar: true,
          showEasing: 'swing',
          hideEasing: 'linear',
          showMethod: 'fadeIn',
          hideMethod: 'fadeOut',
          showDuration: '9599',
          hideDuration: '500995'
        }
        if (validatorLogin) {
          resolve([200, header])
        } else {
          toastr.error('Usuario o contraseña no validas', 'Error!');
          reject([
            400,
            "Error al ingresar al portal",
          ])
        }
      })
    }
  })

  mock.onPost("/post-jwt-profile").reply(config => {
    const user = JSON.parse(config["data"])

    const one = config.headers

    let finalToken = one.Authorization

    const validUser = users.filter(usr => usr.uid === user.idx)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Verify Jwt token from header.Authorization
        if (finalToken === accessToken) {
          if (validUser["length"] === 1) {
            let objIndex

            //Find index of specific object using findIndex method.
            objIndex = users.findIndex(obj => obj.uid === user.idx)

            //Update object's name property.
            users[objIndex].username = user.username

            // Assign a value to locastorage
            localStorage.removeItem("authUser")
            localStorage.setItem("authUser", JSON.stringify(users[objIndex]))

            resolve([200, "Profile Editted successfully"])
          } else {
            reject([400, "Something wrong for edit profile"])
          }
        } else {
          reject([400, "Invalid Token !!"])
        }
      })
    })
  })

  mock.onPost("/post-fake-profile").reply(config => {
    const user = JSON.parse(config["data"])

    const validUser = users.filter(usr => usr.uid === user.idx)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (validUser["length"] === 1) {
          let objIndex

          //Find index of specific object using findIndex method.
          objIndex = users.findIndex(obj => obj.uid === user.idx)

          //Update object's name property.
          users[objIndex].username = user.username

          // Assign a value to locastorage
          localStorage.removeItem("authUser")
          localStorage.setItem("authUser", JSON.stringify(users[objIndex]))

          resolve([200, "Profile Editted successfully"])
        } else {
          reject([400, "Something wrong for edit profile"])
        }
      })
    })
  })

  mock.onPost("/fake-forget-pwd").reply(config => {
    // User needs to check that user is eXist or not and send mail for Reset New password

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, "Check you mail and reset your password."])
      })
    })
  })

  mock.onPost("/post-jwt-register").reply(config => {
    const user = JSON.parse(config["data"])
    users.push(user)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, user])
      })
    })
  })

  mock.onPost("/post-jwt-login").reply(config => {
    const user = JSON.parse(config["data"])
    const validUser = users.filter(
      usr => usr.email === user.email && usr.password === user.password
    )

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (validUser["length"] === 1) {
          // You have to generate AccessToken by jwt. but this is fakeBackend so, right now its dummy
          const token = accessToken

          // JWT AccessToken
          const tokenObj = { accessToken: token } // Token Obj
          const validUserObj = { ...validUser[0], ...tokenObj } // validUser Obj

          resolve([200, validUserObj])
        } else {
          reject([
            400,
            "Username and password are invalid. Please enter correct username and password",
          ])
        }
      })
    })
  })

  mock.onPost("/post-jwt-profile").reply(config => {
    const user = JSON.parse(config["data"])

    const one = config.headers

    let finalToken = one.Authorization

    const validUser = users.filter(usr => usr.uid === user.idx)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Verify Jwt token from header.Authorization
        if (finalToken === accessToken) {
          if (validUser["length"] === 1) {
            let objIndex

            //Find index of specific object using findIndex method.
            objIndex = users.findIndex(obj => obj.uid === user.idx)

            //Update object's name property.
            users[objIndex].username = user.username

            // Assign a value to locastorage
            localStorage.removeItem("authUser")
            localStorage.setItem("authUser", JSON.stringify(users[objIndex]))

            resolve([200, "Profile Editted successfully"])
          } else {
            reject([400, "Something wrong for edit profile"])
          }
        } else {
          reject([400, "Invalid Token !!"])
        }
      })
    })
  })

  mock.onPost("/post-fake-profile").reply(config => {
    const user = JSON.parse(config["data"])

    const validUser = users.filter(usr => usr.uid === user.idx)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (validUser["length"] === 1) {
          let objIndex

          //Find index of specific object using findIndex method.
          objIndex = users.findIndex(obj => obj.uid === user.idx)

          //Update object's name property.
          users[objIndex].username = user.username

          // Assign a value to locastorage
          localStorage.removeItem("authUser")
          localStorage.setItem("authUser", JSON.stringify(users[objIndex]))

          resolve([200, "Profile Editted successfully"])
        } else {
          reject([400, "Something wrong for edit profile"])
        }
      })
    })
  })

  mock.onPost("/jwt-forget-pwd").reply(config => {
    // User needs to check that user is eXist or not and send mail for Reset New password

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, "Check you mail and reset your password."])
      })
    })
  })

  mock.onPost("/social-login").reply(config => {
    const user = JSON.parse(config["data"])

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user && user.token) {
          // You have to generate AccessToken by jwt. but this is fakeBackend so, right now its dummy
          const token = accessToken

          // JWT AccessToken
          const tokenObj = { accessToken: token } // Token Obj
          const validUserObj = { ...user[0], ...tokenObj } // validUser Obj

          resolve([200, validUserObj])
        } else {
          reject([
            400,
            "Username and password are invalid. Please enter correct username and password",
          ])
        }
      })
    })
  })

  mock.onGet(url.GET_TASKS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (tasks) {
          // Passing fake JSON data as response
          resolve([200, tasks])
        } else {
          reject([400, "Cannot get tasks"])
        }
      })
    })
  })

  mock.onGet(url.GET_EVENTS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (events) {
          // Passing fake JSON data as response
          resolve([200, events])
        } else {
          reject([400, "Cannot get events"])
        }
      })
    })
  })

  mock.onPost(url.ADD_NEW_EVENT).reply(event => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (event && event.data) {
          // Passing fake JSON data as response
          resolve([200, event.data])
        } else {
          reject([400, "Cannot add event"])
        }
      })
    })
  })

  mock.onPut(url.UPDATE_EVENT).reply(event => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (event && event.data) {
          // Passing fake JSON data as response
          resolve([200, event.data])
        } else {
          reject([400, "Cannot update event"])
        }
      })
    })
  })

  mock.onDelete(url.DELETE_EVENT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.event])
        } else {
          reject([400, "Cannot delete event"])
        }
      })
    })
  })

  mock.onGet(url.GET_CATEGORIES).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (calenderTypeEvent) {
          // Passing fake JSON data as response
          resolve([200, calenderTypeEvent])
        } else {
          reject([400, "Cannot get categories"])
        }
      })
    })
  })

}

export default fakeBackend
