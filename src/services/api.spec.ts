import { mapsService } from './api';
import api from './api';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(api);

describe('mapsService', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('geocode', () => {
    it('deve retornar coordenadas para um endereço válido', async () => {
      const mockResult = {
        latitude: -23.55052,
        longitude: -46.633308,
        address: 'São Paulo, SP'
      };

      mock.onGet('/maps/geocode', { params: { address: 'São Paulo' } }).reply(200, mockResult);

      const result = await mapsService.geocode('São Paulo');

      expect(result).toEqual(mockResult);
    });
  });

  describe('searchPlaces', () => {
    it('deve retornar uma lista de lugares', async () => {
      const mockResult = [
        {
          latitude: -23.55052,
          longitude: -46.633308,
          address: 'São Paulo, SP'
        }
      ];

      mock.onGet(/\/maps\/search/).reply(200, mockResult);

      const result = await mapsService.searchPlaces('São Paulo');

      expect(result).toEqual(mockResult);
    });
  });
});
