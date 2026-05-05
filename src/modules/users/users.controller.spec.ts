import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const usersService = {
    findUserById: jest.fn(),
    removeAsRequester: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  it('blocks non-admin users from reading other profiles', async () => {
    await expect(
      controller.findOne(7, { id: 3, role: 'USER' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('allows user to read own profile', async () => {
    usersService.findUserById.mockResolvedValue({ id: 3, email: 'a@b.com' });

    await expect(
      controller.findOne(3, { id: 3, role: 'USER' }),
    ).resolves.toEqual({ id: 3, email: 'a@b.com' });
  });

  it('throws when profile does not exist', async () => {
    usersService.findUserById.mockResolvedValue(null);

    await expect(
      controller.findOne(5, { id: 1, role: 'ADMIN' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('delegates delete checks to service with requester context', async () => {
    usersService.removeAsRequester.mockResolvedValue(undefined);

    await controller.remove(5, { id: 1, role: 'ADMIN' });

    expect(usersService.removeAsRequester).toHaveBeenCalledWith(5, 1, 'ADMIN');
  });
});
