const net = require('net');

// Replace 'your_server_ip', 'your_server_port', and 'your_server_password' with actual values.
const serverIP = '23.88.73.88';
const serverPort = '9815';
const serverPassword = '1155';

// List of random names (adjust as needed)
const randomNames = [
  'John Doe',
  'Jane Smith',
  'Mike Johnson',
  'Emily Brown',
  'Chris Wilson',
  'Linda Lee',
  // Add more names here
];

// Function to generate a random nickname from the list
function getRandomNickname() {
  return randomNames[Math.floor(Math.random() * randomNames.length)];
}

// Function to connect to the SA-MP server and join with a random nickname
function connectAndJoinServer() {
  const client = new net.Socket();

  client.connect(serverPort, serverIP, () => {
    console.log('Connected to the SA-MP server.');

    // Generate a random nickname
    const nickname = getRandomNickname();

    // Send the connection request packet
    const connectionPacket = `SAMP${String.fromCharCode(
      ...serverIP.split('.').map((octet) => parseInt(octet, 10))
    )}${String.fromCharCode(serverPort & 0xFF, serverPort >> 8)}x${String.fromCharCode(
      serverPassword.length & 0xFF,
      serverPassword.length >> 8
    )}${serverPassword}${String.fromCharCode(
      nickname.length & 0xFF,
      nickname.length >> 8
    )}${nickname}`;
    client.write(connectionPacket);
  });

  client.on('data', (data) => {
    const response = data.toString('binary', 11).trim();

    // Check if the connection response indicates success
    if (response === 'pConnectOK') {
      console.log('Successfully joined the server.');
    } else {
      console.error('Failed to join the server:', response);
    }

    client.destroy(); // Close the connection after receiving the response
  });

  client.on('error', (err) => {
    console.error('Error connecting to the SA-MP server:', err.message);
    client.destroy(); // Close the connection on error
  });

  client.on('close', () => {
    console.log('Connection closed.');
  });
}

// Connect and join the server
connectAndJoinServer();
