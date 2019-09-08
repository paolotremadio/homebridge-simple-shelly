# homebridge-simple-shelly Plugin

`homebridge-simple-shelly` is a [Homebridge](https://github.com/nfarina/homebridge) plugin with which you can switch ON/OFF the Shelly-device via Apple HomeKit.

The plugin is based on the common REST-API of the Shelly-device:  [Rest-API-Documentation](http://shelly-api-docs.shelly.cloud/#shelly-family-overview)

## Installation

First of all you need to have [Homebridge](https://github.com/nfarina/homebridge) installed. Refer to the according README.md of this repository for instructions.  

Then run the following command to install `homebridge-simple-shelly`:

```
sudo npm install -g homebridge-simple-shelly
```

## Configuration

|        Parameter       |                                     Description                                     | Required |
| -----------------------| ----------------------------------------------------------------------------------- |:--------:|
| `name`                 | name of the accessory (also taken to call in "Siri") |     ✓    |
| `url`                  | url of the shelly device |     ✓    |
| `channel`     | *default* `0` <br> (Shelly2 as two channels, `0` or `1`) |          |
| `username`     | if authentication is enabled on the Shelly, provide an username <br> *default* `admin` |          |
| `password`             | if authentication is enabled on the Shelly, provide a password |          |

Example of configuration:

```json
{
    "accessories": [
        {
          "accessory": "SimpleShelly",
          "name": "Shelly Lamp",
          "url": "http://192.168.1.1",
          "channel": 0
        }   
    ]
}
```
