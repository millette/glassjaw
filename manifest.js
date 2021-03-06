'use strict'

const Confidence = require('confidence')
const Config = require('./config')
const criteria = { env: process.env.NODE_ENV }

const manifest = {
  $meta: 'This file defines GlassJaw.',
  server: {
    app: {
      siteTitle: Config.get('/app/siteTitle'),
      languages: Config.get('/i18n/locales')
    },
    cache: 'catbox-redis',
    debug: { log: ['error'], request: ['error'] },
    connections: { routes: { security: true } }
  },
  connections: [{
    port: Config.get('/port/web'),
    labels: ['web']
  }],
  registrations: [
    {
      plugin: {
        register: 'hapi-i18n',
        options: {
          locales: Config.get('/i18n/locales'),
          defaultLocale: 'fr',
          // cookie: 'localeCookie',
          autoReload: Config.get('/i18n/autoReload'),
          updateFiles: Config.get('/i18n/updateFiles'),
          indent: '  ',
          directory: 'locales'
        }
      }
    },
    {
      plugin: {
        options: {
          cookie: {
            password: Config.get('/cookie/password'),
            secure: Config.get('/cookie/secure')
          }
        },
        register: './plugins/login/index'
      },
      options: { routes: { prefix: '/user' } }
    },
    {
      plugin: {
        register: 'hapi-favicon',
        options: { path: 'assets/img/favicon.ico' }
      }
    },
//    { plugin: 'hapi-accept-language' },
    { plugin: 'hapi-context-app' },
    { plugin: 'hapi-context-credentials' },
    { plugin: 'h2o2' },
    { plugin: 'inert' },
    { plugin: 'vision' },
    { plugin: './plugins/pick-language/index' },
    {
      plugin: './server/api/index',
      options: { routes: { prefix: '/api' } }
    },
    {
      options: { routes: { prefix: '/{languageCode}' } },
      plugin: {
        register: './server/main/index',
        options: { templateCached: Config.get('/cache/web') }
      }
    },
    {
      plugin: {
        register: './server/web/index',
        options: { templateCached: Config.get('/cache/web') }
      }
    }
  ]
}

const store = new Confidence.Store(manifest)
exports.get = (key) => store.get(key, criteria)
exports.meta = (key) => store.meta(key, criteria)
