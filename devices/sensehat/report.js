/**
 * External dependencies
 */
const wp = require( 'wordpress' );
const debug = require( 'debug' )( 'biab:sensehat:report' );

/**
 * Internal dependencies
 */
const config = require( 'config' );
const constants = require( './constants' );

function report( ) {
	debug( 'Creating weather report' );

	const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
	const baseDate = new Date();
	const today = baseDate.toISOString().split( 'T' )[ 0 ]; // today, as in 2017-01-12
	const yesterday = () => new Date( baseDate.getTime() - DAY_IN_MILLISECONDS ).toISOString().split( 'T' )[ 0 ];
	const aWeekBeforeToday = () => new Date( baseDate.getTime() - ( 7 * DAY_IN_MILLISECONDS ) ).toISOString().split( 'T' )[ 0 ];
	const aMonthBeforeToday = () => new Date( baseDate.getTime() - ( 30 * DAY_IN_MILLISECONDS ) ).toISOString().split( 'T' )[ 0 ];

	const getAfter = ( ) => {
		const settings = config.get( constants.settings, constants.defaults );
		const period = settings.report;
		switch ( period ) {
			case 'daily':
				return yesterday();
			case 'weekly':
				return aWeekBeforeToday();
			case 'monthly':
				return aMonthBeforeToday();
			default:
				return today;
		}
	};

	wp.posts()
	.create( {
		title: new Date().toLocaleTimeString(),
		content: '[sensehat before="' + today + '" after="' + getAfter( ) + '"]',
		status: 'publish',
	} )
	.then( response => {
		debug( 'Post ' + response.id + ' created: ' + response.link );
		this.emit( 'sensehat-report-published', response );
	} )
	.catch( error => {
		this.emit( 'error', 'Unable to save report to WP - ' + error.message );
	} );
}

module.exports = report;
