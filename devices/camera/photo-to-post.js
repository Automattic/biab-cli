/**
 * External dependencies
 */

const debug = require( 'debug' )( 'biab:camera:photo-to-post' );

/**
 * External dependencies
 */

const wp = require( 'wordpress' );

const getPhotoName = () => 'photo-' + process.pid + '.jpg';
const getPostTitle = title => title ? title : new Date().toLocaleTimeString();

function getImageContent( media ) {
	const { width, height } = media.media_details.sizes.large;
	const sized = media.source_url.replace( '.jpg', `-${ width }x${ height }.jpg` );

	return `<img src="${ sized }" width="${ width }" height="${ height }" />`;
}

function createPost( emitter, media, title ) {
	debug( 'Creating post' );

	wp.posts()
		.create( {
			title: title,
			featured_media: media.id, // eslint-disable-line camelcase
			content: getImageContent( media ),
			status: 'publish',
		} )
		.then( response => {
			debug( 'Post ' + response.id + ' created: ' + response.link );
			emitter.emit( 'photo-published', response );
		} )
		.catch( error => {
			emitter.emit( 'error', 'Unable to save photo to WP - ' + error.message );
		} );
}

function uploadPhoto( commandData, photo ) {
	debug( 'Uploading photo with title: ' + getPostTitle( commandData ) );

	wp.media()
		.file( photo, getPhotoName() )
		.create()
		.then( response => {
			debug( 'Photo ' + response.id + ' uploaded: ' + response.source_url );
			createPost( this, response, getPostTitle( commandData ) );
		} )
		.catch( error => {
			this.emit( 'error', 'Unable to save photo to WP - ' + error.message );
		} );
}

module.exports = uploadPhoto;
