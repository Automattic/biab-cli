# Blog In A Box

Blog In A Box for WordPress comes as two parts:

- [WordPress plugin](https://github.com/tinkertinker/biab-plugin)
- [CLI utility](https://github.com/tinkertinker/biab-cli)

### WordPress Plugin

The plugin may be found in the [companion repository](https://github.com/tinkertinker/biab-plugin) and it is installed as per a normal WordPress plugin.

### CLI Utility Manual Installation

This repository contains the CLI tools, which should be installed in the following location (default, but can be changed):

`/opt/bloginabox/`

`sudo` access must be given to the `www-data` user so that PHP can call these tools. To do this:

`sudo visudo`

And add this line:

`www-data ALL=(pi:pi) NOPASSWD: /opt/bloginabox/biab`

The WordPress plugin will then have access to the `/opt/bloginabox/biab` CLI tool, and from here can trigger and receive data from hardware devices.

Note: this is done automatically when using [Blog In A Box Installer](https://github.com/tinkertinker/biab-installer).

## CLI Utility

The web server can interface with devices through a single executable:

`/opt/bloginabox/biab`

This can also be called from the command line or via any external tool.

The executable loads up a series of device handlers that listen for commands and perform actions. For example:

`./biab camera-take-photo`

This triggers the camera module to take a picture and can optionally trigger the SenseHAT to display an image.

### Developing a device handler

Device handlers are added in the `devices` directory, and should be loaded in `devices/index.js`.

Each device should export a single entry function that accepts an `EventEmitter`. The device handler can listen to events on this emitter:

```js
module.exports = function( emitter ) {
	emitter.on( 'do-something', function( args ) {
		console.log( 'Received do-something command with ' + args );
	} );
};
```

This will be triggered with:

`./biab do-something some-data`

The listener can perform whatever functions it needs to achieve the desired effect. If the handler should return data to the caller then it can finish with:

```js
this.emit( 'result', 'data-to-be-returned' );
```

The utility is run as the `pi` user, and has access to all devices that this user can access.

## Contributing

We welcome contributions in any form, and you can help reporting, testing, and detailing bugs.

## License

The Blog In A Box theme is licensed under [GNU General Public License v2 (or later)](./LICENSE.md).
