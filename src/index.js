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


    // Set internal state
    this.lastState = null;
    this.statusPollTimer = null;


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
    this.log('Setting Shelly', { on });

    try {
      // Set status
      await this.client.get('', { params: { turn: on ? 'on' : 'off' } });
      this.lastState = on;
      debug('setOn(): success');
    } catch (error) {
      this.log('Error in setting Shelly', error.toString());
      debug('setOn(): failed', error);
    }

    callback();
  }

  async pollForStatus() {
    debug('pollForStatus()');
    clearTimeout(this.statusPollTimer);

    try {
      const { data } = await this.client.get('');
      debug('pollForStatus(): success', data);

      const isOn = data.ison;

      this.switchService
        .getCharacteristic(Characteristic.On)
        .updateValue(isOn);

      this.lastState = isOn;
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
