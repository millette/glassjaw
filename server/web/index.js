'use strict'

const _ = require('lodash')

const frontPage = function (request, reply) {
  const language = request.i18n.locale || request.i18n.getLocale()
  // const language = request.state.localeCookie || request.i18n.locale || request.i18n.getLocale()
  // console.log('state1:', request.state) // expecting
  // request.i18n.setLocale(language)
  return reply
    .view('pick-language', { languageChoice: language })
}

exports.register = function (server, options, next) {
/*
  server.state('localeCookie', {
    autoValue: (request, next) => {
      console.log(
        'hello:',
        request.i18n.locale || request.i18n.getLocale(),
        request.i18n.locale,
        request.i18n.getLocale(),
        Object.keys(request)
      )
      next(null, request.i18n.locale || request.i18n.getLocale())
    },
    isSecure: false
  })
*/

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
