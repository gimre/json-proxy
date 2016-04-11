'use strict'

const transformObject = ( object, valueTransform ) => {
    for( const key in object ) {
        const value = object[ key ]
        switch( typeof value ) {
            case 'object':
                object[ key ] = transformObject( value, valueTransform )
                break
            case 'string':
            case 'number':
            case 'boolean':
                object[ key ] = valueTransform( value )
                break
            default:
                object[ key ] = value
                break
        }
    }
    return object
}

const transformJSON = ( json, valueTransform ) => {
    const object = typeof json === 'object' ? json : JSON.parse( json )
    return JSON.stringify( transformObject( object, valueTransform ) )
}

exports = module.exports = ( crypto, pkey ) => ( {
    decodeJSON: ( json ) => transformJSON( json, ( value ) => {
        return crypto.privateDecrypt( pkey, new Buffer( value, 'base64' ) )
            .toString( 'utf8' )
    } ),
    encodeJSON: ( json  ) => transformJSON( json, ( value ) => {
        return crypto.publicEncrypt( pkey, new Buffer( value ) )
            .toString( 'base64' )
    } )
} )

exports[ '@singleton' ] = true
exports[ '@require' ] = [
    'crypto',
    'private-key'
]
