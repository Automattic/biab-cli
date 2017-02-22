/**
 * External dependencies
 */

const debug = require( 'debug' )( 'biab:sensehat' );

/**
 * Internal dependencies
 */

const config = require( 'config' );
const constants = require( './constants' );
const scheduleReading = require( './schedule-reading' );
const scheduleReport = require( './schedule-report' );
const settings = require( './settings' );
const dataToWP = require( './data-to-wp' );
const capture = require( './capture' );
const display = require( './display' );
const report = require( './report' );

function returnPost( post ) {
	this.emit( 'result', JSON.stringify( { id: post.id } ) );
}

module.exports = function( emitter ) {
	const conf = config.get( constants.settings, constants.defaults );

	debug( 'Enabling Sensehat' );

	emitter.on( 'sensehat-capture', capture );
	emitter.on( 'sensehat-reading', dataToWP );
	emitter.on( 'sensehat-settings', scheduleReading );
	emitter.on( 'sensehat-settings', scheduleReport );
	emitter.on( 'sensehat-settings', settings );
	emitter.on( 'sensehat-report', report );
	emitter.on( 'sensehat-report-published', returnPost );

	// Display output
	if ( conf.display ) {
		debug( 'Enabling Sensehat display' );
		emitter.on( 'sensehat-reading', display.showReading );
		emitter.on( 'camera-take-photo', display.showCamera );
		emitter.on( 'photo-published', display.clearDisplay );
		emitter.on( 'error', display.clearDisplay );
	}
};
