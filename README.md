# homebridge-unitec

Homebridge plugin purpose-built for controlling 433MHz radio frequency outlets by unitec. The plugin is based on [homebridge-rfoutlets](https://github.com/wstameris/homebridge-rfoutlets). Homebridge maintains state information, so you can always know if you left that lamp on. It uses [unitec-rfsend](https://github.com/Piets/unitec-rfsend).

Tested on a Raspberry Pi 2 - Model B running Raspbian (Debian) and Node.js v6.9.0. This should work on most Raspberry Pi models, however YMMV

Supports *lights*, *switches*, and *fans*

## Installation

- Install homebridge  
`sudo npm install -g homebridge`

- Install homebridge-rfoutlets  
`sudo npm install -g homebridge-unitec`

- Update your homebridge configuration

## Notes

- The user which homebridge is run from must be on the list of *sudoers* as the `unitec-rfsend` executable requires root privileges
- A great guide on how to record RF signals and set up your Pi to transmit can be found [here](https://www.samkear.com/hardware/control-power-outlets-wirelessly-raspberry-pi "Pi 433Mhz Transmitter Guide"). Note: the web portion of the guide is not required
- **CAUTION**: GPIO pin 0 is hardcoded within the binary.

## Configuration

- `name`: Name of your device
- `type`: `Light`, `Switch`, or `Fan` (**required**)
- `manufacturer`: manufacturer of the device plugged into the outlet (*optional*, defaults to *blank*)
- `model`: model of the device plugged into the outlet (*optional*, defaults to *blank*)
- `serial`: serial number of the device plugged into the outlet (*optional*, defaults to *blank*)
- `rf_on`: RF signal to turn the outlet on (**required**)
- `rf_off`: RF signal to turn the outlet off (**required**)

See `sample-config.json`
