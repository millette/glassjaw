'use strict'

const _ = require('lodash')

const frontPage = function (request, reply) {
  const language = request.i18n.locale || request.i18n.getLocale()
  reply.view('pick-language', { languageChoice: language })
}

exports.register = function (server, options, next) {
  server.views({
    engines: { html: require('lodash-vision') },
    path: 'templates',
    partialsPath: 'templates/partials',
    isCached: options.templateCached
  })

/*
  server.route({
    method: 'GET',
    path: '/{languageCode}',
    handler: { view: 'index' }
  })
*/
  server.route({
    method: 'GET',
    path: '/{languageCode}/',
    handler: { view: 'index' }
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: frontPage
  })

  server.route({
    method: 'GET',
    path: '/{languageCode}/partials',
    handler: { view: 'partials' }
  })

  server.route({
    method: 'GET',
    path: '/{languageCode}/multilingual',
    handler: { view: 'multilingual' }
  })

  server.route({
    method: 'GET',
    path: '/css/{param*}',
    handler: { directory: { path: 'assets/css/' } }
  })

  server.route({
    method: 'GET',
    path: '/js/{param*}',
    handler: { directory: { path: 'assets/js/' } }
  })

  server.route({
    method: 'GET',
    path: '/img/{param*}',
    handler: { directory: { path: 'assets/img/' } }
  })

  next()
}

exports.register.attributes = {
  name: 'web',
  dependencies: ['hapi-i18n', 'hapi-context-app', 'vision', 'inert']
}
