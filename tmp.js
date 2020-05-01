const Toolkit = require('./dist').default;

const client = new Toolkit(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

client.deploy({
  name: 'test2',
  version: '1.0.3',
  url: 'https://twilio.com',
}).then(console.log)
  .catch(e => {
    console.log(e);
  });

// const axios = new HttpClient({
//   auth: {
//     username: process.env.ACCOUNT_SID,
//     password: process.env.AUTH_TOKEN,
//   },
//   baseURL: 'https://flex-api.twilio.com/v1/PluginService/Plugins'
// });
//
// axios.post('', {UniqueName: 'foo123'})
//   .then(console.log)
//   .catch(console.log)
