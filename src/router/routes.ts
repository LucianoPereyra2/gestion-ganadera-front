import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/login', component: () => import('pages/Auth/LoginPage.vue') },
      // requiresAuth: el guard del router (router/index.ts) exige sesion iniciada
      { path: '/clientes', component: () => import('pages/Cliente/ClientesPage.vue'), meta: { requiresAuth: true } },
      { path: '/empleados', component: () => import('pages/Empleado/EmpleadosPage.vue'), meta: { requiresAuth: true } },
      { path: '/lotes', component: () => import('pages/Lote/LotesPage.vue'), meta: { requiresAuth: true } },
      { path: '/movimientos-lote', component: () => import('pages/MovimientoLote/MovimientoLotePage.vue'), meta: { requiresAuth: true } },
      { path: '/pesajes', component: () => import('pages/Pesaje/PesajePage.vue'), meta: { requiresAuth: true } },
      { path: '/sector', component: () => import('pages/Sector/SectorPage.vue'), meta: { requiresAuth: true } },

    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
