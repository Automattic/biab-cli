/**
 * External dependencies
 */

const exec = require( 'child_process' ).exec;
const debug = require( 'debug' )( 'biab:sensehat:capture' );

function capture( wp, commandData ) {
	const cmd = `/usr/bin/python ${ __dirname }/capture.py`;

	debug( 'Capturing data: ' + cmd );

	exec( cmd, ( error, stdout, stderr ) => {
		if ( error ) {
			debug( 'Unable to capture sensehat data' );
			this.emit( 'error', 'Unable to capture sensehat data' );
		} else {
			const json = JSON.parse( stdout );
			debug( 'Data captured - temp=' + json.temperature + ' humidity=' + json.humidity + ' pressure=' + json.pressure );
			this.emit( 'sensehat-reading', wp, commandData, json );
		}
	} );
}

module.exports = capture;
