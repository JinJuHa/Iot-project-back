const SocketIO = require("socket.io");
const SerialPort = require("serialport").SerialPort;
console.log(SerialPort);
//const sp = new SerialPort({ path: "COM7", baudRate: 9600 });

// sp.on("open", function () {
//   console.log("Serial Port OPEN");
// sp.on("data", function (data) {
//     console.log(data.toString());
//   });
// });

module.exports = (server, app) => {
  const io = SocketIO(
    server,
    {
      cors: {
        origin: "*",
      },
    },
    { path: "/about" }
  );
  app.set("io", io);
  const about = io.of("/about");
//   const message = [1]

  about.on("connection", socket => {
    console.log('a user connected');


    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    const sp = new SerialPort({ path: "COM7", baudRate: 9600 });

    sp.on("open", function () {
      console.log("Serial Port OPEN");
      sp.on("data", function (data) {
        console.log(data.toString());
        socket.emit('my broadcast', data.toString());
      });
    });

    
    // socket.emit('my broadcast', (data)=>data.toString());
    // socket.on('my message', (msg) => {
    //     io.emit('my broadcast', `server: ${msg}`);
    //     console.log('message: ' + msg);
    //   });
    

  });


};

// emit으로 보내고 on으로 받는다.