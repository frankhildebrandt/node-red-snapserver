var net = require('net');

module.exports = function (RED) {

    function SnapClientVolume(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var server = RED.nodes.getNode(config.server);
        var volume = 100;
        var muted = false;

        node.on('input', function (msg) {
            var client = new net.Socket();
            client.connect(server.port || 1705, server.host, function () {

                if (msg.payload === "MUTE") {
                    msg.payload = {"muted": true}
                    muted = true;
                } else if (msg.payload === "UNMUTE") {
                    msg.payload = {"muted": false}
                    muted = false;
                } else if (!isNaN(msg.payload)) {
                    volume = parseInt(msg.payload);
                    msg.payload = {"volume": parseInt(msg.payload)}
                }
                var data = {
                    "id": 1, "jsonrpc": "2.0", "method": "Client.SetVolume", "params": {
                        "id": config.id || msg.payload.id,
                        "volume": {
                            'muted': msg.payload.muted,
                            'percent': msg.payload.volume
                        }
                    }
                };
                if (data.params.volume.percent) {
                    volume = data.params.volume.percent;
                }
                node.status({fill: "green", shape: "ring", text: "Muted: " + muted + " Volume: " + volume});
                client.write('                ' + JSON.stringify(data) + ' \n');
                client.close();
            });

        })

    }

    RED.nodes.registerType("snap-client-volume", SnapClientVolume);

};