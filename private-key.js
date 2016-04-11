'use strict'

exports = module.exports = ( fs ) => fs.readFileSync( './private.key' )

exports[ '@require' ] = [
    'fs'
]
