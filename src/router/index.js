import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../components/Login')
const Home = () => import('../components/Home')
const Welcome = () => import('../components/Welcome')
const Users = () => import('../components/Users')
const Rights = () => import('../components/Rights')
const Roles = () => import('../components/Roles')
const Categories = () => import('../components/Categories')
const Params = () => import('../components/Params')
const Goods = () => import('../components/Good')
const Orders = () => import('../components/Orders')
const Reports = () => import('../components/Reports')
Vue.use(VueRouter)

const routes = [
  {path:'',redirect:'/login'},
  {path: '/login',component:Login},
  {
    path: '/home',
    component:Home,
    children:[
      {
        path:'',
        redirect:'/welcome'
      },
      {
        path:'/welcome',
        component:Welcome
      },
      {
        path:'/users',
        component:Users
      },
      {
        path:'/rights',
        component:Rights
      },
      {
        path:'/roles',
        component:Roles
      },
      {
        path:'/categories',
        component:Categories
      },
      {
        path:'/params',
        component:Params
      },
      {
        path:'/goods',
        component:Goods
      },
      {
        path:'/orders',
        component:Orders
      },
      {
        path: '/reports',
        component:Reports
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//设置路由导航守卫，为除/login之外的界面设置权限
router.beforeEach((to,from,next) => {
  if(to.path === '/login') return next();
  const token = window.sessionStorage.getItem("token")
  if(!token) return next('login')
  next()
})
export default router
