import { BadRequestException } from "@nestjs/common";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  const buildService = () => {
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            id: 1,
            ...data,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        ),
      },
    };

    const service = new UsersService(prisma as any, {} as any);
    return { service, prisma };
  };

  it("defaults public registration to USER", async () => {
    const { service, prisma } = buildService();

    await service.createUserLightweight({
      email: "user@example.com",
      password: "password123",
    });

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ role: "USER" }),
      }),
    );
  });

  it("allows TENANT during public registration", async () => {
    const { service, prisma } = buildService();

    await service.createUserLightweight({
      email: "tenant@example.com",
      password: "password123",
      role: "TENANT",
    });

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ role: "TENANT" }),
      }),
    );
  });

  it("blocks ADMIN during public registration", async () => {
    const { service } = buildService();

    await expect(
      service.createUserLightweight({
        email: "admin@example.com",
        password: "password123",
        role: "ADMIN" as any,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
