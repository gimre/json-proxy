'use strict';

// setup ioc
const ioc = require( 'electrolyte' )
ioc.use( ioc.node_modules( ) )
ioc.use( ioc.node( './' ) )

const app     = ioc.create( 'koa' )( )
const koaBody = ioc.create( 'koa-body' )
const proxy   = ioc.create( 'koa-pixie-proxy' )( {
    host: 'https://httpbin.org'
} )
const {
    decodeJSON, encodeJSON
} = ioc.create( './json-encoder' )


app.use( koaBody( ) )

app.use( function* impersonateHost( next ) {
    const { req } = this
    const { body, headers } = this.request

    if( Object.keys( body ).length ) {
        req.body = decodeJSON( body )
    }

    req.headers = Object.assign( { }, headers, {
        host: 'httpbin.org'
    } )

    yield next
} )

app.use( proxy( ) )

app.use( function* obfuscateJson( next ) {
    this.body = encodeJSON( this.body )
    yield next
} )

app.listen( 3210 )

