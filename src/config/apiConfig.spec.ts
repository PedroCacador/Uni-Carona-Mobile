describe('resolveApiBaseUrl', () => {
  const originalEnv = process.env.EXPO_PUBLIC_API_URL;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.EXPO_PUBLIC_API_URL;
    } else {
      process.env.EXPO_PUBLIC_API_URL = originalEnv;
    }
    jest.resetModules();
  });

  it('normaliza URL sem protocolo', () => {
    process.env.EXPO_PUBLIC_API_URL = '192.168.1.10:3333';
    const { resolveApiBaseUrl } = require('./apiConfig');
    expect(resolveApiBaseUrl()).toBe('http://192.168.1.10:3333');
  });

  it('mantém URL com http', () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://192.168.1.10:3333';
    const { resolveApiBaseUrl } = require('./apiConfig');
    expect(resolveApiBaseUrl()).toBe('http://192.168.1.10:3333');
  });

  it('remove barra final', () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://192.168.1.10:3333/';
    const { resolveApiBaseUrl } = require('./apiConfig');
    expect(resolveApiBaseUrl()).toBe('http://192.168.1.10:3333');
  });

  it('lança erro quando variável não está definida', () => {
    delete process.env.EXPO_PUBLIC_API_URL;
    const { resolveApiBaseUrl } = require('./apiConfig');
    expect(() => resolveApiBaseUrl()).toThrow(/EXPO_PUBLIC_API_URL/);
  });
});
