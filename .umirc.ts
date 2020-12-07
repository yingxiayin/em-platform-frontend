import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  base: '/',
  publicPath: '../static/',
  // history: 'hash',
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: './login' },
    {
      path: '/transfer',
      wrappers: ['@/wrappers/LoginAuth'],
      routes: [{ path: '/transfer/:id', component: './transfer' }],
    },
  ],
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:5000/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'Style Transfer Tool',
        dll: false,

        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
};

export default config;
