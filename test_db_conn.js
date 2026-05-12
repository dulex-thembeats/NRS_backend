const net = require('net');
const dns = require('dns');

const host = 'ep-billowing-silence-anuava6f.c-6.us-east-1.aws.neon.tech';
const port = 5432;

console.log(`Resolving ${host}...`);
dns.lookup(host, (err, address, family) => {
  if (err) {
    console.error('DNS Lookup Error:', err);
    return;
  }
  console.log(`Resolved to ${address} (IPv${family})`);

  console.log(`Connecting to ${address}:${port}...`);
  const client = net.createConnection({ host: address, port: port }, () => {
    console.log('Successfully connected to TCP port!');
    client.end();
  });

  client.on('error', (err) => {
    console.error('Connection Error:', err);
  });
});
