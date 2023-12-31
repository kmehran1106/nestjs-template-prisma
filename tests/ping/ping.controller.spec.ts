import { Test } from '@nestjs/testing';
import { PingController } from 'ping/ping.controller';
import { PingService } from 'ping/ping.service';

describe('PingController', () => {
  let pingController: PingController;
  let pingService: PingService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PingController],
      providers: [PingService],
    }).compile();

    pingService = moduleRef.get(PingService);
    pingController = moduleRef.get(PingController);
  });

  describe('getPing', () => {
    it('should return a pong', async () => {
      // Given
      jest.spyOn(pingService, 'getPing').mockResolvedValue('Pong!');

      // When
      const result = await pingController.getPing();

      // Then
      expect(result).toBe('Pong!');
    });
  });
});
