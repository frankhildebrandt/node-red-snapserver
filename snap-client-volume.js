var net = require('net');

module.exports = function (RED) {

    function SnapClientVolume(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var server = RED.nodes.getNode(config.server);

        node.on('input', function (msg) {
            var client = new net.Socket();
            client.connect(server.port || 1705, server.host, function () {
                var data = {
                    "id": 1, "jsonrpc": "2.0", "method": "Client.SetVolume", "params": {
                        "id": config.id || msg.payload.id,
                        "volume": {
                            'muted': parseInt(config.muted) || msg.payload.muted,
                            'percent': parseInt(config.volume) || msg.payload.volume
                        }
                    }
                };
                client.write('                ' + JSON.stringify(data) + ' \n');
            });

        })

    }

    RED.nodes.registerType("snap-client-volume", SnapClientVolume);

};