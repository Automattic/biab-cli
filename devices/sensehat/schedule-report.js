/**
 * External dependencies
 */

const path = require( 'path' );
const debug = require( 'debug' )( 'biab:sensehat:schedule-report' );

/**
 * Internal dependencies
 */

const cron = require( 'cron/special-strings' );

function setSensehatCron( commandData ) {
	const cmd = path.resolve( path.join( __dirname, '..', '..', 'biab' ) ) + ' sensehat-report';
	const success = () => {
		this.emit( 'result', 'scheduled' );
	};
	const error = msg => {
		this.emit( 'error', msg );
	};
	cron( cmd, commandData, success, error );
}

module.exports = setSensehatCron;
