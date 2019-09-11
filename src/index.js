const debug = require('debug')('homebridge-simple-shelly');
const axios = require('axios');

let Service;
let Characteristic;

class SimpleShelly {
  constructor(log, config) {
    this.log = log;
    this.name = config.name;

    const auth = config.username || config.password ? {
      username: config.username || 'admin',
      password: config.password,
    } : null;

    this.client = axios.create({
      baseURL: `${config.url}/relay/${config.channel || 0}`,
      auth,
      timeout: 15000,
    });

    this.autoOff = config.autoOff || null;


    // Set internal state
    this.lastState = null;
    this.statusPollTimer = null;
    this.autoOffTimer = null;


    // Initialise Services
    this.switchService = new Service.Switch(this.name);
    this.switchService
      .getCharacteristic(Characteristic.On)
      .on('get', (callback) => callback(null, this.lastState))
      .on('set', this.setOn.bind(this));


    // Poll for status and start timer
    debug('constructor(): poll for status');
    this.pollForStatus();
  }

  getServices() {
    return [this.switchService];
  }

  async setOn(on, callback) {
    debug('setOn()', { on });
    this.log('Setting', { on });

    try {
      // Set status
      await this.setState(on, false);
      debug('setOn(): success');
    } catch (error) {
      this.log('Error in setting Shelly', error.toString());
      debug('setOn(): failed', error);
    }

    callback();
  }

  async setState(isOn, updateHomekit = true) {
    const { lastState } = this;
    debug(`setState() - Last state: ${lastState} - New state: ${isOn}`);

    // Set internal state anyway
    debug('setState(): setting internal state');
    this.lastState = isOn;

    // Check for a change in state
    if (lastState !== isOn) {
      debug('setState(): state is changed, updating');

      // Log
      this.log('State changed', { previousState: lastState, currentState: isOn });

      // Make request
      debug('setState(): making request');
      await this.client.get('', { params: { turn: isOn ? 'on' : 'off' } });

      // Update HomeKit
      if (updateHomekit) {
        debug('setState(): updating HomeKit');
        this.switchService
          .getCharacteristic(Characteristic.On)
          .updateValue(isOn);
      }

      // Set auto-off timeout
      clearTimeout(this.autoOffTimer);

      if (isOn && this.autoOff) {
        debug('setState(): setting auto-off timer');
        this.log(`Auto turn off: starting a timer for ${this.autoOff} seconds`);

        this.autoOffTimer = setTimeout(() => {
          debug('setState(): auto-off timer ran out, turning off');
          this.log('Auto turn off: time is up, turning off');
          this.setState(false);
        }, this.autoOff * 1000);
      }
    }
  }

  async pollForStatus() {
    debug('pollForStatus()');
    clearTimeout(this.statusPollTimer);

    try {
      const { data } = await this.client.get('');
      debug('pollForStatus(): success', data);

      const isOn = data.ison;
      await this.setState(isOn, true);
    } catch (error) {
      this.log('Could not update state.', error.toString());
      debug('pollForStatus(): failed', error);
    }

    setTimeout(
      () => {
        debug('pollForStatus(): timer is up, poll for status');
        this.pollForStatus();
      },
      5000,
    );
  }
}

module.exports = (homebridge) => {
  Service = homebridge.hap.Service; // eslint-disable-line
  Characteristic = homebridge.hap.Characteristic; // eslint-disable-line
  homebridge.registerAccessory('homebridge-simple-shelly', 'SimpleShelly', SimpleShelly);
};
