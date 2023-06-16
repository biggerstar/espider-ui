import { createRouter, createWebHistory } from 'vue-router'

const dashBoardChildrenRouter = [
  {
    path: 'DashBoard',
    name: 'DashBoard',
    component:()=> import('../views/Panel/DashBoardView.vue')
  },
  {
    path: 'Setting',
    name: 'Setting',
    component:()=> import('../views/Panel/SettingView.vue')
  },
  {
    path: 'PluginManager',
    name: 'PluginManager',
    component:()=>import('../views/Panel/PluginManagerView.vue')
  },
  {
    path: 'SpiderManager',
    name: 'SpiderManager',
    component:()=>import( '../views/Panel/SpiderManagerView.vue')
  },
]

const SpiderCreationChildrenRouter = [
  {
    path: 'GuidePage',
    name: 'GuidePage',
    component: ()=> import('../views/SpiderCreation/GuidePage/GuidePage.vue'),
  },
  {
    path: 'Browser',
    name: 'Browser',
    component: ()=> import('../views/SpiderCreation/Browser/Browser.vue'),
  },
  {
    path: 'Editor',
    name: 'Editor',
    component: ()=> import('../views/SpiderCreation/MonacoEditor/MonacoEditor.vue'),
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:  [
    {
      path: '/',
      redirect: '/Panel'
    },
    {
      path: '/Panel',
      component: ()=> import('../views/Panel/PanelView.vue'),
      redirect: '/Panel/DashBoard',
      children: dashBoardChildrenRouter
    },
    {
      path: '/SpiderCreation',
      component: ()=> import('../views/SpiderCreation/SpiderCreation.vue'),
      redirect:'/SpiderCreation/GuidePage',
      children:SpiderCreationChildrenRouter
    }

  ]
})

export default router
