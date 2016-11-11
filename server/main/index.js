'use strict'

const Wreck = require('wreck')
const Config = require('../../config')

exports.register = (server, options, next) => {
  server.views({
    engines: { html: require('lodash-vision') },
    path: 'templates',
    partialsPath: 'templates/partials',
    isCached: options.templateCached
  })

  const newDoc = function (request, reply) {
    // console.log(Object.keys(request))
    // console.log(request.payload)
    // console.log(request.params)
    const doc = { _id: request.payload.id, i18n: { } }
    // request.payload._id = request.payload.id
    // const id =
    delete request.payload.id
    doc.i18n[request.params.languageCode] = request.payload
    console.log(doc)
    reply('yup')
  }

  const mapper = (request, callback) => {
    const it = [Config.get('/db/url'), 'ya']
    it.push(request.params.pathy ? request.params.pathy : '_all_docs')
    callback(null, it.join('/') + '?include_docs=true', { accept: 'application/json' })
  }

  const responder = (err, res, request, reply, settings, ttl) => {
    const go = (err, payload) => {
      if (err) { return reply(err) } // FIXME: how to test?
      let tpl
      let obj
      if (payload._id) {
        tpl = 'doc'
        obj = { doc: payload }
      } else if (payload.rows) {
        tpl = 'docs'
        obj = { docs: payload.rows.map((d) => d.doc) }
      } else {
        return reply.notImplemented('What\'s that?', payload)
      }
      reply.view(tpl, obj).etag(res.headers.etag)
    }

    if (err) { return reply(err) } // FIXME: how to test?
    if (res.statusCode >= 400) { return reply(res.statusMessage).code(res.statusCode) }
    Wreck.read(res, { json: true }, go)
  }

  server.route({
    method: 'GET',
    path: '/new',
    config: {
      auth: {
        mode: 'required'
      },
      handler: { view: 'new-doc' }
    }
  })

  server.route({
    method: 'POST',
    path: '/new',
    config: {
      auth: {
        mode: 'required'
      },
      handler: newDoc
    }
  })

  server.route({
    method: 'GET',
    path: '/{pathy*}',
    handler: {
      proxy: {
        passThrough: true,
        mapUri: mapper,
        onResponse: responder
      }
    }
  })

  next()
}

exports.register.attributes = {
  name: 'main',
  dependencies: ['hapi-i18n', 'h2o2', 'vision']
}
