const HttpClient = require('./packages/flex-plugins-api-client/dist/clients/client').default;
const ReleasesClient = require('./packages/flex-plugins-api-client/dist/clients/releases').default;

const client = new ReleasesClient(new HttpClient(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN));
// PageSize=5&Page=1&PageToken=PTRks2Y2RlN2RiM2MwMjY0ZGRjYzM4NjkyMDNjOGQyMGNkNjox'
client
  // .list()
  .list({ pageSize: 5, pageToken: 'PTRks2Y2RlN2RiM2MwMjY0ZGRjYzM4NjkyMDNjOGQyMGNkNjox', page: 1 })
  .then(console.log);
