# homebridge-simple-shelly Plugin

`homebridge-simple-shelly` is a [Homebridge](https://github.com/nfarina/homebridge) plugin with which you can switch ON/OFF the Shelly-device via Apple HomeKit.

The plugin is based on the common REST-API of the Shelly-device:  [Rest-API-Documentation](http://shelly-api-docs.shelly.cloud/#shelly-family-overview)

## Installation

First of all you need to have [Homebridge](https://github.com/nfarina/homebridge) installed. Refer to the according README.md of this repository for instructions.  

Then run the following command to install `homebridge-simple-shelly`:

```
sudo npm install -g homebridge-simple-shelly
```

## Configuration Params

In your central configuration `config.json` of your homebridge environment you can configure this plugin as a normal accessory.

Name of accessory: `shelly`
 
|        Parameter       |                                     Description                                     | Required |
| -----------------------| ----------------------------------------------------------------------------------- |:--------:|
| `name`                 | name of the accessory (also taken to call in "Siri")                                                              |     ✓    |
| `url`                  | url of the shelly device                                        |     ✓    |
| `channel`     | *default* `0` <br> (later with Shelly2 planned for `0` or `1`)                                                                  |          |
| `username`     | *default* `admin` |          |
| `password`             | password for request (no username, because `admin` as default) - in case this attribute is provided, the access is done via security mode                                                          |          |

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
