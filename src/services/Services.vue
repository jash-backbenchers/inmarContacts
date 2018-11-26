<script>
  // import axios from 'axios';
  import contacts from '@/MOCK_DATA1.json'

  import {
    notification,
  } from 'ant-design-vue'

const correct_login={
    "success": true,
    "description": "sucessfully logged in",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmY4NDQ4YmQ0YmRjYzAzOTA2NGM2ZDQiLCJmaXJzdF9uYW1lIjoiamFzd2FudGgiLCJsYXN0X25hbWUiOiJjaG9kYXZhcmFwdSIsIm1vYmlsZSI6Ijk1MDIwODI0ODEiLCJlbWFpbCI6Imphc3dhbnRoLmNob2RhdmFyYXB1QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE1NDMxNDA0MTYsImV4cCI6MTU0MzE3NjQxNn0.KEcS27k4UN5a8FaWDGerCaG3MjkYD5mRvO7_o7PZvSQ",
    "user": {
        "_id": "5bf8448bd4bdcc039064c6d4",
        "first_name": "jaswanth",
        "last_name": "chodavarapu",
        "mobile": "9502082481",
        "email": "jaswanth.chodavarapu@gmail.com",
        "username": "admin",
        "__v": 0
    }
};

const wrong_login={
    "description": "invalid username or password",
    "success": false
}
  class REST {
    API_URL = 'http://localhost:8080/api/v1'
    page_size = 20;

    // eslint-disable-next-line
    get token() {
      return localStorage.getItem('Token');
    }

    // eslint-disable-next-line
    get token_title() {
      // return process.env.TOKEN_TITLE;
      return 'x-access-token'
    }

    list({
      resource = null,
      params = {},
      page = 1,
      page_size = null,
    }) {
      if (resource === null) {
        resource = this.api;
      }
      params.page = page;
      params.page_size = page_size === null ? this.page_size : page_size;
      var start = ((params.page - 1) * params.page_size)
      var end = params.page * params.page_size
      var temp_contacts = [...contacts]
      if (params.sortField && params.sortOrder) {
        temp_contacts.sort(function (a, b) {
          var nameA = a[params.sortField].toUpperCase(); // ignore upper and lowercase
          var nameB = b[params.sortField].toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
        temp_contacts=(params.sortOrder==='ascend')?temp_contacts:temp_contacts.reverse()
      }
      var result = {
        docs: temp_contacts.slice(start, end),
        totalDocs: temp_contacts.length,
        limit: params.page_size,
        page: page,
        totalPages: Math.ceil(temp_contacts.length / params.page_size),
        hasNextPage: (temp_contacts[end + 1] != undefined),
        nextPage: (temp_contacts[end + 1] != undefined) ? page + 1 : null,
        hasPrevPage: (temp_contacts[start - 1] != undefined),
        prevPage: (temp_contacts[start - 1] != undefined) ? page - 1 : null,
      }

      return new Promise(function (resolve, reject) {
        setTimeout(() => resolve({
          data: result
        }), 1000);
      });
    }

    create({
      resource = null,
      params = {},
      data = {}
    }) {
      if (resource === null) {
        resource = this.api;
      }
      // return axios({
      //   method: 'post',
      //   url: resource,
      //   data,
      //   headers: {
      //     "x-access-token": `${this.token}`,          
      //   },
      //   params,
      // });
      data._id = contacts[0]._id + contacts.length
      contacts.push(data)
      return new Promise(function (resolve, reject) {
        setTimeout(() => resolve({
          data
        }), 1000);
      });
    }

    update({
      resource = null,
      params = {},
      data = {}
    }) {
      if (resource === null) {
        resource = this.api;
      }
      // return axios({
      //   method: 'put',
      //   url: resource,
      //   data,
      //   params,
      //   headers: {
      //     "x-access-token": `${this.token}`,          
      //   },
      // });
      delete data.editable
      const newData = [...contacts]
      const result = newData.map(contact => (contact._id === data._id) ? data : contact)

      return new Promise(function (resolve, reject) {
        setTimeout(() => resolve({
          data: result
        }), 300);
      });
    }

    delete({
      resource = null,
      params = {}
    }) {
      if (resource === null) {
        resource = this.api;
      }
      // return axios({
      //   method: 'delete',
      //   url: resource,
      //   params,
      //   headers: {
      //     "x-access-token": `${this.token}`,          
      //   },
      // });
      const index = contacts.map(e => e._id).indexOf(params.id)
      return new Promise(function (resolve, reject) {
        setTimeout(() => resolve({
          data: contacts.splice(index, 1)
        }), 300);
      });
    }
  }

  // Authentication
  class Authentication {
    API_URL = 'http://localhost:8080/api/v1'
    // To set the token in localstorage
    setToken(token) {
      localStorage.setItem('Token', token);
    }

    getToken() {
      return localStorage.getItem('Token');
    }

    // To remove the token from localstorage
    removeLocalStorage() {
      localStorage.clear();
    }

    // To check user is authenticated
    // To validate the token
    isAuthenticated(to, from, next) {
      // TODO: Setup a dummy JWT required route
      if (localStorage.getItem('Token')) {
        next();
      } else {
        window.location.href = '/login';
      }
    }

    // To login using username(email) & password
    login(username, password) {
      localStorage.setItem('API_DOMAIN', this.API_URL);
      // Validate creds
      const creds = {
        username,
        password,
      };
      // return axios.post(`${this.API_URL}/authentication/login`, creds);
      // console.log(correct_login)
      return new Promise(function (resolve, reject) {
        setTimeout(() => resolve({
          data:(username==='admin'&&password==='12345')?correct_login:wrong_login
        }), 1000);
      });
    }

    // To remove the token from server & localstorage
    logout() {
      this.removeLocalStorage();
    }
  }


  class Api extends REST {
    api = `${this.API_URL}`
  }

  // Noty
  class Noty {
    // eslint-disable-next-line
    success(message, title = 'Success') {
      notification.success({
        message: title,
        description: message,
      });
    }

    warning(message, title = 'Warning') {
      notification.warning({
        message: title,
        description: message,
      });
    }

    error(message, title = 'Attention Required') {
      notification.error({
        message: title,
        description: message,
      });
    }

    info(message, title = 'Info') {
      notification.info({
        message: title,
        description: message,
      });
    }
  }

  export default {
    REST,
    auth: new Authentication(),
    api: new Api(),
    noty: new Noty()
  };
</script>