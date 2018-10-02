const s3StaticSite = require('./s3-static-site');

s3StaticSite.deploy({
  bucket: 'slides.kalarrs.com',
  cloudFrontId: 'E3FRRS65YID617'
}).then(_ => {
  console.log('Deployment complete');
}).catch(e => {
  console.log('Something went wrong!', e);
});

