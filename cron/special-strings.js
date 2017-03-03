/**
 * External dependencies
 */

const debug = require( 'debug' )( 'biab:cron' );
const exec = require( 'child_process' ).exec;

function updateCrontab( command, interval, successCallback, errorCallback ) {
	const cmd = `( crontab -l | grep -v -F "${ command }" ; echo "${ interval } ${ command }" ) | crontab -`;

	debug( 'Adding to cron: ' + interval );
	debug( 'Crontab comamnd: ' + cmd );

	exec( cmd, ( error ) => {
		if ( error ) {
			return errorCallback( 'Failed to schedule: ' + error.message );
		}

		return successCallback();
	} );
}

function removeCrontab( command, successCallback, errorCallback ) {
	const cmd = `( crontab -l | grep -v -F "${ command }" ) | crontab -`;

	debug( 'Removing from cron' );
	debug( 'Crontab comamnd: ' + cmd );

	exec( cmd, ( error ) => {
		if ( error ) {
			return errorCallback( 'Failed to schedule: ' + error.message );
		}

		return successCallback();
	} );
}

const specialStrings = [ 'daily', 'weekly', 'monthly' ];
module.exports = function( command, schedule, success, error ) {
	debug( `Cron schedule: @"${ schedule }"` );
	if ( specialStrings.indexOf( schedule ) > -1 ) {
		return updateCrontab( command, '@' + schedule, success, error );
	}

	return removeCrontab( command, success, error );
};
