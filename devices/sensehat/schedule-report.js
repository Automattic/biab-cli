/**
 * External dependencies
 */

const path = require( 'path' );
const debug = require( 'debug' )( 'biab:sensehat:schedule-report' );

/**
 * Internal dependencies
 */

const cron = require( 'cron' );

function setSensehatCron( schedule ) {
	const cmd = path.resolve( path.join( __dirname, '..', '..', 'biab' ) ) + ' sensehat-report';
	const success = () => {
		this.emit( 'result', 'scheduled' );
	};
	const error = msg => {
		this.emit( 'error', msg );
	};
	const getDays = ( days ) => {
		switch ( days ) {
			case 'daily':
				return 1;
			case 'weekly':
				return 7;
			case 'monthly':
				return 30;
			default:
				return 0;
		}
	};
	const getReportSchedule = ( sched ) => {
		const parts = sched.split( ' ' );
		const days = parts.length > 4 ? getDays( parts[ 4 ] ) : 0;
		return days + ' day';
	};
	cron( cmd, getReportSchedule( schedule ), success, error );
}

module.exports = setSensehatCron;
