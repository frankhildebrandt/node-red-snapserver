var net = require('net');

module.exports = function (RED) {

    function SnapServer(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.status({fill: "red", shape: "ring", text: "initializing"});

        var server = RED.nodes.getNode(config.server);

        node.status({fill: "blue", shape: "ring", text: "getting status"});

        setTimeout(function () {
            server.send({"id":666,"jsonrpc":"2.0","method":"Server.GetStatus"});
        }, 1000);

        server.on('data', function (msg) {
            node.status({fill: "green", shape: "ring", text: "connected"});

            try {
                var data = JSON.parse(msg.toString());

                if (data.id === 666) data.method = "Server.OnInitialData";

                switch (data.method) {
                    case "Client.OnConnect":
                        break;
                    case "Client.OnDisconnect":
                        break;
                    case "Client.OnVolumeChanged":
                        break;
                    case "Client.OnLatencyChanged":
                        break;
                    case "Client.OnNameChanged":
                        break;
                    case "Group.OnMute":
                        break;
                    case "Group.OnStreamChanged":
                        break;
                    case "Stream.OnUpdate":
                        break;
                    case "Server.OnUpdate":
                        break;
                    case "Server.OnInitialData":
                        node.send({payload: data.result.server});
                        break;
                    default:
                        break;
                }
            } catch (e) {
            }
        });

        node.on('close', function () {
        });
    }

    RED.nodes.registerType("snap-events", SnapServer);

};