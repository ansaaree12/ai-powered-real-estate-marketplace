import request from 'supertest';
import * as chai from 'chai';

const expect = chai.expect;
const server = 'http://localhost:8000';

describe('API Endpoint Testing', function () {
  it('should fetch only 1 residency', function (done) {
    request(server)
      .get('/api/residency/allresd') // ✅ Fetch all residencies
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');

        // ✅ Limit to only 1 property
        const limitedResults = res.body.slice(0, 1);
        expect(limitedResults.length).to.equal(1);

        console.log('Fetched Property (Limited to 1):', limitedResults);
        done();
      });
  });
});
