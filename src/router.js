import Vue from 'vue'
import Router from 'vue-router'
import Base from './skelton/Base.vue'
import Services from './services/Services.vue'

import Authentication from './views/Authentication/Authentication.vue'
import Contacts from './views/Contacts/Contacts.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login/',
      name: 'Authentication',
      component: Authentication
    },
    {
      path: '',
      name: 'Base',
      component:Base,
      beforeEnter: Services.auth.isAuthenticated,
      children: [
        {
          path: 'contacts/',
          name: 'Contacts',
          component: Contacts
        },
        {
          path: '*',
          redirect: '/contacts',
        },
      ]
    }
  ]
})
