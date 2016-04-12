'use strict';

// setup ioc
const ioc = require( 'electrolyte' )
ioc.use( ioc.node_modules( ) )
ioc.use( ioc.node( './' ) )

const app     = ioc.create( 'koa' )( )
const koaBody = ioc.create( 'koa-body' )
const proxy   = ioc.create( 'koa-pixie-proxy' )( {
    host: 'http://dev.services.aqr.com/',
    request: {
        followRedirect: false
    }
} )
const {
    decodeJSON, encodeJSON
} = ioc.create( './json-encoder' )


app.use( koaBody( ) )

app.use( function* impersonateHost( next ) {
    const { req } = this
    const { body, headers, type } = this.request

    if( type === 'application/json' ) {
        if( Object.keys( body ).length ) {
            req.body = decodeJSON( body )
        }
    }

    req.headers = Object.assign( { }, headers, {
        host: /^localhost/.test( headers.host ) ?
            'dev.services.aqr.com':
            headers.host
    } )

    yield next
} )

app.use( proxy( ) )

app.use( function* obfuscateJson( next ) {
    if( this.type === 'application/json' ) {
        this.body = encodeJSON( this.body )
    }
    yield next
} )

app.listen( 3210 )

