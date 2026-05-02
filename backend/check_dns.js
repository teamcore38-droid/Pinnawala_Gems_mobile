import dns from 'node:dns';

const resolveSrv = async () => {
  try {
    const records = await dns.promises.resolveSrv('_mongodb._tcp.cluster.cubqbx2.mongodb.net');
    console.log('SRV records:', records);
  } catch (err) {
    console.error('SRV lookup failed:', err.code || err.message);
  }
};

const resolveA = async () => {
  try {
    const records = await dns.promises.resolve4('cluster.cubqbx2.mongodb.net');
    console.log('A records:', records);
  } catch (err) {
    console.error('A lookup failed:', err.code || err.message);
  }
};

await resolveSrv();
await resolveA();
