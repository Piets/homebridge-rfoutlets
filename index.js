var Service, Characteristic, limiter, cmdBase;
var exec = require("child_process").exec,
    RateLimiter = require('limiter').RateLimiter;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    limiter = new RateLimiter(1, 200); //limit requests to one per 200ms
    homebridge.registerAccessory("homebridge-unitec",
        "Unitec",
        RFOutletAccessory);
}

function RFOutletAccessory(log, config) {
    this.log = log;

    //Accessory information
    this.name = config["name"];
    this.type = config["type"];
    this.manufacturer = config["manufacturer"];
    this.model = config["model"];
    this.serial = config["serial"];

    //RF transmit inforamtion
    this.rf_on = config["rf_on"];
    this.rf_off = config["rf_off"];
    this.pin = config["pin"];

    cmdBase = "sudo " + //the unitec-rfsend executable requires root
        __dirname + //module directory
        "/unitec-rfsend \"";
}

RFOutletAccessory.prototype = {
    setPowerState: function(powerOn, callback) {
        var state;
        var cmd;

        if (powerOn) {
            cmd = cmdBase + this.rf_on + "\"";
            state = "on";
        } else {
            cmd = cmdBase + this.rf_off + "\"";
            state = "off";
        }

        this.log("Turning " + this.name + " " + state);
        cmd = cmd + " " + this.pin;

        limiter.removeTokens(1, function() {
            exec(cmd, function(error, stdout, stderr) {
                if (error) {
                    console.log(error);
                }
                callback();
            })
        });
    },

    identify: function(callback) {
        this.log("HomeKit identify requested");
        callback();
    },

    getServices: function() {
        var informationService = new Service.AccessoryInformation();

        informationService
            .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
            .setCharacteristic(Characteristic.Model, this.model)
            .setCharacteristic(Characteristic.SerialNumber, this.serial);

        var outletService;

        switch (this.type) {
            case "Switch":
                this.outletService = new Service.Switch(this.name);
                break;
            case "Light":
                this.outletService = new Service.Lightbulb(this.name);
                break;
            case "Fan":
                this.outletService = new Service.Fan(this.name);
                break;
            default:
                this.outletService = new Service.Switch(this.name);
        }

        this.outletService
            .getCharacteristic(Characteristic.On)
            .on('set', this.setPowerState.bind(this));

        return [informationService, this.outletService];
    }
};
