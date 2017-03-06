/**
 * External dependencies
 */

const debug = require( 'debug' )( 'biab:cron:special' );
const exec = require( 'child_process' ).exec;

const specialStrings = [ 'daily', 'weekly', 'monthly' ];

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

module.exports = function( command, schedule, success, error ) {
	const special = specialStrings.find( item => schedule.indexOf( item ) !== -1 );

	debug( `Cron schedule: @"${ schedule }" - ${ special }` );

	if ( special ) {
		return updateCrontab( command, '@' + special, success, error );
	}

	return removeCrontab( command, success, error );
};
