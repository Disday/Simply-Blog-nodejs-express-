import request from 'supertest';
import jestSupertestMatchers from 'jest-supertest-matchers';

import solution from '../index.js';
// const { matchers } = jestSupertestMatchers;
const matchers = jestSupertestMatchers;

describe('posts requests', () => {
  beforeAll(() => {
    expect.extend(matchers);
  });

  it('GET /', async () => {
    const res = await request(solution()).get('/');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET /posts', async () => {
    const res = await request(solution()).get('/posts');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET /posts/new', async () => {
    const res = await request(solution())
      .get('/posts/new');
    expect(res).toHaveHTTPStatus(200);
  });

  it('POST /posts', async () => {
    const res = await request(solution())
      .post('/posts')
      .type('form')
      .send({ title: 'post title', body: 'post body' });
    expect(res).toHaveHTTPStatus(302);
  });

  it('POST /posts (errors)', async () => {
    const res = await request(solution())
      .post('/posts');
    expect(res).toHaveHTTPStatus(422);
  });

  it('GET posts/:id/edit', async () => {
    const app = solution();
    const res1 = await request(app)
      .post('/posts')
      .type('form')
      .send({ title: 'post title', body: 'post body' });
    expect(res1).toHaveHTTPStatus(302);
    const url = res1.headers.location;
    const res2 = await request(app)
      .get(url);
    expect(res2).toHaveHTTPStatus(200);
  });

  it('PATCH posts/:id', async () => {
    const app = solution();
    const res1 = await request(app)
      .post('/posts')
      .type('form')
      .send({ title: 'post title', body: 'post body' });
    const url = res1.headers.location.match(/\/posts\/\d+/)[0];
    const res2 = await request(app)
      .patch(url)
      .type('form')
      .send({ title: 'new post title', body: 'new post body' });
    expect(res2).toHaveHTTPStatus(302);
  });

  it('PATCH posts/:id (unproccessable entity)', async () => {
    const app = solution();
    const res1 = await request(app)
      .post('/posts')
      .type('form')
      .send({ title: 'post title', body: 'post body' });
    const url = res1.headers.location.match(/\/posts\/\d+/)[0];
    const res2 = await request(app)
      .patch(url);
    expect(res2).toHaveHTTPStatus(422);
  });

  it('DELETE posts/:id', async () => {
    const app = solution();
    const res1 = await request(app)
      .post('/posts')
      .type('form')
      .send({ title: 'post title', body: 'post body' });
    const url = res1.headers.location.match(/\/posts\/\d+/)[0];
    const res2 = await request(app)
      .delete(url);
    expect(res2).toHaveHTTPStatus(302);
  });
});

describe('user and session requests', () => {
  beforeAll(() => {
    expect.extend(matchers);
  });
  it('GET /session/new', async () => {
    const res = await request(solution())
      .get('/session/new');
    expect(res).toHaveHTTPStatus(200);
  });

  it('POST /session', async () => {
    const res = await request(solution())
      .post('/session')
      .type('form')
      .send({ nickname: 'admin', password: 'qwerty' });
    expect(res).toHaveHTTPStatus(302);
  });

  it('POST /session (errors)', async () => {
    const res = await request(solution())
      .post('/session')
      .type('form')
      .send({ nickname: 'admin', password: 'qwery' });
    expect(res).toHaveHTTPStatus(422);
  });

  it('DELETE /session', async () => {
    const app = solution();
    const authRes = await request(app)
      .post('/session')
      .type('form')
      .send({ nickname: 'admin', password: 'qwerty' });
    expect(authRes).toHaveHTTPStatus(302);
    const cookie = authRes.headers['set-cookie'];

    const res = await request(app)
      .delete('/session')
      .set('Cookie', cookie);
    expect(res).toHaveHTTPStatus(302);
  });

  it('GET /', async () => {
    const res = await request(solution())
      .get('/');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET /users/new', async () => {
    const res = await request(solution())
      .get('/users/new');
    expect(res).toHaveHTTPStatus(200);
  });

  it('POST /users', async () => {
    const query = request(solution());
    const data = { nickname: 'nickname', password: 'qwer' };

    const res = await query
      .post('/users')
      .type('form')
      .send(data);
    expect(res).toHaveHTTPStatus(302);

    const res2 = await query
      .post('/session')
      .type('form')
      .send(data);
    expect(res2).toHaveHTTPStatus(302);

    const res3 = await query
      .post('/session')
      .type('form')
      .send({});
    expect(res3).toHaveHTTPStatus(422);
  });
});

describe('flash message tests', () => {
  it('POST /users', async () => {
    const res = await request(solution())
      .post('/users')
      .type('form')
      .send({ nickname: 'nickname', password: 'qwer' })
      .redirects(1);

    expect(res).toHaveHTTPStatus(200);
    // console.log(res.text);
    // expect(res.text.includes('nickname')).toBe(true);
  });

  it('GET /session/new', async () => {
    const res = await request(solution())
      .get('/session/new');
    expect(res).toHaveHTTPStatus(200);
  });

  it('POST /session', async () => {
    const res = await request(solution())
      .post('/session')
      .type('form')
      .send({ nickname: 'admin', password: 'qwerty' })
      .redirects(1);

    expect(res).toHaveHTTPStatus(200);
    // expect(res.text.includes('Welcome, admin!')).toBe(true);
  });

  it('POST /session (errors)', async () => {
    const res = await request(solution())
      .post('/session')
      .type('form')
      .send({ nickname: 'admin', password: 'qwery' });
    expect(res).toHaveHTTPStatus(422);
  });

  it('DELETE /session', async () => {
    const app = solution();
    const authRes = await request(app)
      .post('/session')
      .type('form')
      .send({ nickname: 'admin', password: 'qwerty' });
    expect(authRes).toHaveHTTPStatus(302);
    const cookie = authRes.headers['set-cookie'];

    const res = await request(app)
      .delete('/session')
      .set('Cookie', cookie)
      .redirects(1);

    expect(res).toHaveHTTPStatus(200);
    expect(res.text.includes('Good bye, admin')).toBe(true);
  });
});
