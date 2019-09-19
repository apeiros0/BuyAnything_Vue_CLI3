import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '*',
      redirect: '/index',
    },
    {
      path: '/user',
      name: 'User',
      component: () => import('./components/User.vue'),
      children: [
        {
          // / 是指根目錄
          path: '/index',
          name: 'Index',
          component: () => import('./views/Index.vue'),
        },
        {
          path: '/products',
          name: 'Products',
          component: () => import('./views/Products.vue'),
          props: route => ({ category: route.query.category }),
        },
        {
          path: '/coupons',
          name: 'Coupons',
          component: () => import('./views/Coupons.vue'),
        },
        {
          path: '/checkout',
          component: () => import('./components/Checkout.vue'),
          children: [
            {
              path: '',
              name: 'Carts',
              component: () => import('./views/Carts.vue'),
            },
            {
              path: 'check_order/:orderId',
              name: 'CheckOrder',
              component: () => import('./views/CheckOrder.vue'),
            },
          ],
        },
        {
          path: '/signin',
          name: 'Signin',
          component: () => import('./views/Signin.vue'),
        },
        {
          path: '/product_info/:productId',
          name: 'ProductInfo',
          component: () => import('./views/ProductInfo.vue'),
        },
      ],
    },
    {
      path: '/admin',
      component: () => import('./components/Dashboard/Dashboard.vue'),
      children: [
        {
          path: 'products',
          name: 'Dashboard_Products',
          component: () => import('./views/Dashboard/Products.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'orders',
          name: 'Dashboard_Orders',
          component: () => import('./views/Dashboard/Orders.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'coupons',
          name: 'Dashboard_Coupons',
          component: () => import('./views/Dashboard/Coupons.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
});
