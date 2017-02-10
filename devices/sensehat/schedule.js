/**
 * External dependencies
 */

const path = require( 'path' );

/**
 * Internal dependencies
 */

const cron = require( 'cron' );

function setSensehatCron( schedule ) {
	const cmd = path.resolve( path.join( __dirname, '..', 'biab' ) ) + ' sensehat-capture';
	const success = () => {
		this.emit( 'result', 'scheduled' );
	};
	const error = msg => {
		this.emit( 'error', msg );
	};

	cron( cmd, schedule, success, error );
}

module.exports = setSensehatCron;
