import request from 'supertest';
import jestSupertestMatchers from 'jest-supertest-matchers';
import solution from '../index.js';

const matchers = jestSupertestMatchers;

beforeAll(() => {
  expect.extend(matchers);
});

describe('Unauthorized actions', () => {
  it('Unauthorized actions', async () => {
    const query = request(solution());
    const userData = { nickname: 'nickname', password: 'qwer' };

    const signUpRes = await query
      .post('/users')
      .type('form')
      .send(userData)
      .redirects(1);
    expect(signUpRes).toHaveHTTPStatus(200);

    const authRes = await query
      .post('/session')
      .type('form')
      .send(userData)
      .redirects(1);
    const cookie = authRes.headers['set-cookie'];
    expect(authRes).toHaveHTTPStatus(200);

    const postData = { title: 'new post title', body: 'new post body' };
    const patchRes = await query
      .patch('/posts/1')
      .type('form')
      .send(postData)
      .set('Cookie', cookie)
      .redirects(1);
    expect(patchRes.text.includes("You don't have permission for this action")).toBe(true);

    const deleteRes = await query
      .delete('/posts/1')
      .set('Cookie', cookie)
      .redirects(1);
    expect(deleteRes).toHaveHTTPStatus(200);
    expect(deleteRes.text.includes("You don't have permission for this action")).toBe(true);
  });
});

describe('Authorized actions', () => {
  it('Authorized actions)', async () => {
    const query = request(solution());
    const userData = { nickname: 'nickname', password: 'qwer' };

    const signUpRes = await query
      .post('/users')
      .type('form')
      .send(userData);
    expect(signUpRes).toHaveHTTPStatus(302);

    const authRes = await query
      .post('/session')
      .type('form')
      .send(userData);
    const cookie = authRes.headers['set-cookie'];
    expect(authRes).toHaveHTTPStatus(302);

    const newPostFormRes = await query
      .get('/posts/new')
      .set('Cookie', cookie);
    expect(newPostFormRes).toHaveHTTPStatus(200);

    const createPostRes = await query
      .post('/posts')
      .type('form')
      .send({ title: 'Test post title', body: 'Test post body' })
      .set('Cookie', cookie);
    const url = createPostRes.headers.location.match(/\/posts\/\d+/)[0];

    const newData = { title: 'new post title', body: 'new post body' };
    const patchRes = await query
      .patch(url)
      .type('form')
      .send(newData)
      .set('Cookie', cookie)
      .redirects(1);
    expect(patchRes.text.includes(newData.body)).toBe(true);

    const deleteRes = await query
      .delete(url)
      .set('Cookie', cookie);
    expect(deleteRes.text.includes(newData.title)).toBe(false);

    const logoutRes = await query
      .delete('/session')
      .set('Cookie', cookie)
      .redirects(1);
    expect(logoutRes).toHaveHTTPStatus(200);
    expect(logoutRes.text.includes('Good bye, nickname')).toBe(true);
  });
});

describe('getting forms', () => {
  it('GET /', async () => {
    const res = await request(solution())
      .get('/');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET /posts/new', async () => {
    const res = await request(solution())
      .get('/posts/new');
    expect(res).toHaveHTTPStatus(302);
  });

  it('GET /users/new', async () => {
    const res = await request(solution())
      .get('/users/new');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET /session/new', async () => {
    const res = await request(solution())
      .get('/session/new');
    expect(res).toHaveHTTPStatus(200);
  });
});

describe('invalid requests', () => {
  it('POST /session (errors)', async () => {
    const res = await request(solution())
      .post('/session')
      .type('form')
      .send({ nickname: 'admin', password: 'qwery' });
    expect(res).toHaveHTTPStatus(422);
  });

  it('POST /users (empty)', async () => {
    const query = request(solution());
    const res = await query
      .post('/session')
      .type('form')
      .send({});
    expect(res).toHaveHTTPStatus(422);
  });
});
