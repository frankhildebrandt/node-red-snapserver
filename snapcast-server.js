var net = require('net');

module.exports = function (RED) {


    function RemoteServerNode(n) {
        RED.nodes.createNode(this, n);

        this.host = n.host;
        this.port = n.port;

        var events = {};
        var client = new net.Socket();

        client.connect(n.port || 1705, n.host, function () {
            client.setKeepAlive(1000);
        });

        client.on('data', function(msg) {
            console.log("received: " + msg);
            if (events.data) {
                events.data(msg);
            }
        });

        this.send = function (data) {
            try {
                console.log("Sending:" + JSON.stringify(data));
                client.write('                ' + JSON.stringify(data) + ' \n');
            } catch (e) {
            }
        };

        this.on = function (event, callback) {
            events[event] = callback;
        };

    }


    RED.nodes.registerType("snapcast-server", RemoteServerNode);
};