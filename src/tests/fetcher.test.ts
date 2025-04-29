import { fetcher } from '../lib/fetcher';

describe('fetcher', () => {
  it('throws on non-OK response', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, text: async () => 'fail' });
    await expect(fetcher('/fail')).rejects.toThrow('API error: 500 - fail');
  });
  it('returns JSON on OK response', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ hello: 'world' }) });
    await expect(fetcher('/ok')).resolves.toEqual({ hello: 'world' });
  });
});
