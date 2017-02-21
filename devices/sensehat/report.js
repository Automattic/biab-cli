/**
 * External dependencies
 */
const wp = require( 'wordpress' );
const debug = require( 'debug' )( 'biab:sensehat:report' );

const getPostTitle = title => title ? title : new Date().toLocaleString();

function report( commandData ) {
	debug( 'Creating weather report' );

	const baseDate = new Date();
	const today = baseDate.toISOString().split( 'T' )[ 0 ]; // today, as in 2017-01-12
	const aWeekBeforeToday = new Date( baseDate.getTime() - ( 7 * 24 * 60 * 60 * 1000 ) ).toISOString().split( 'T' )[ 0 ];

	wp.posts()
	.create( {
		title: getPostTitle( commandData ),
		content: '[sensehat before="' + today + '" after="' + aWeekBeforeToday + '"]',
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
