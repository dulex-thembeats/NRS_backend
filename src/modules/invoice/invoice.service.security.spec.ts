import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database';
import { InvoiceService } from './invoice.service';

describe('InvoiceService Security', () => {
  let service: InvoiceService;
  const prismaService = {
    invoice: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    jest.clearAllMocks();
  });

  it('scopes invoice lookup by userId for non-admin requests', async () => {
    prismaService.invoice.findFirst.mockResolvedValue({ irn: 'INV-1' });
    jest.spyOn(service, 'transmitLookupIrn').mockResolvedValue({});

    await service.transmitLookupIrnById(22, { id: 4, role: 'USER' });

    expect(prismaService.invoice.findFirst).toHaveBeenCalledWith({
      where: { id: 22, userId: 4 },
      select: { irn: true },
    });
  });

  it('does not scope invoice lookup for admin requests', async () => {
    prismaService.invoice.findFirst.mockResolvedValue({ irn: 'INV-1' });
    jest.spyOn(service, 'transmitLookupIrn').mockResolvedValue({});

    await service.transmitLookupIrnById(22, { id: 1, role: 'ADMIN' });

    expect(prismaService.invoice.findFirst).toHaveBeenCalledWith({
      where: { id: 22 },
      select: { irn: true },
    });
  });

  it('throws not found when invoice not accessible', async () => {
    prismaService.invoice.findFirst.mockResolvedValue(null);

    await expect(
      service.transmitLookupIrnById(999, { id: 4, role: 'USER' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
