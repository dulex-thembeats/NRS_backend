import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error if FIRS_API_URL is not configured', () => {
      mockConfigService.get.mockReturnValue(undefined);
      expect(() => new ConfigurationService(configService)).toThrow(
        'FIRS_API_URL environment variable is not configured'
      );
    });

    it('should initialize successfully with FIRS_API_URL', () => {
      mockConfigService.get.mockReturnValue('https://api.firs.gov.ng');
      expect(() => new ConfigurationService(configService)).not.toThrow();
    });
  });

  describe('makeFirsApiRequest', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue('https://api.firs.gov.ng');
    });

    it('should make successful API request', async () => {
      const mockData = [{ id: '1', name: 'Test' }];
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await service['makeFirsApiRequest']('/test-endpoint');
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.firs.gov.ng/test-endpoint');
    });

    it('should handle axios error with response', async () => {
      const axiosError = new Error('Network error') as any;
      axiosError.isAxiosError = true;
      axiosError.response = { status: 404 };
      mockedAxios.get.mockRejectedValue(axiosError);

      await expect(service['makeFirsApiRequest']('/test-endpoint')).rejects.toThrow(HttpException);
    });

    it('should handle generic error', async () => {
      const genericError = new Error('Generic error');
      mockedAxios.get.mockRejectedValue(genericError);

      await expect(service['makeFirsApiRequest']('/test-endpoint')).rejects.toThrow(HttpException);
    });
  });

  describe('getInvoiceTypes', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue('https://api.firs.gov.ng');
    });

    it('should return invoice types from FIRS API', async () => {
      const mockData = [
        { id: '1', name: 'Standard Invoice', code: 'SI', description: 'Regular invoice' },
      ];
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await service.getInvoiceTypes();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.firs.gov.ng/invoice-types');
    });
  });

  describe('getPaymentMeans', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue('https://api.firs.gov.ng');
    });

    it('should return payment means from FIRS API', async () => {
      const mockData = [
        { id: '1', name: 'Cash', code: 'CASH', description: 'Physical cash payment' },
      ];
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await service.getPaymentMeans();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.firs.gov.ng/payment-means');
    });
  });

  describe('getTaxCategories', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue('https://api.firs.gov.ng');
    });

    it('should return tax categories from FIRS API', async () => {
      const mockData = [
        { id: '1', name: 'Standard Rate', code: 'SR', rate: 7.5, description: 'Standard VAT rate' },
      ];
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await service.getTaxCategories();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.firs.gov.ng/tax-categories');
    });
  });

  describe('getCurrencies', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue('https://api.firs.gov.ng');
    });

    it('should return currencies from FIRS API', async () => {
      const mockData = [
        { id: '1', name: 'Nigerian Naira', code: 'NGN', symbol: '₦', description: 'Official currency of Nigeria' },
      ];
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await service.getCurrencies();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.firs.gov.ng/currencies');
    });
  });

  describe('getVatExemptions', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue('https://api.firs.gov.ng');
    });

    it('should return VAT exemptions from FIRS API', async () => {
      const mockData = [
        { id: '1', name: 'Basic Food Items', code: 'FOOD', description: 'Essential food items exempt from VAT' },
      ];
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await service.getVatExemptions();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.firs.gov.ng/vat-exemptions');
    });
  });

  describe('getProductCodes', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue('https://api.firs.gov.ng');
    });

    it('should return product codes from FIRS API', async () => {
      const mockData = [
        { id: '1', code: '0101.10.00', description: 'Live horses, pure-bred breeding animals', category: 'Live Animals' },
      ];
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await service.getProductCodes();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.firs.gov.ng/hs-codes');
    });
  });

  describe('getServiceCodes', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue('https://api.firs.gov.ng');
    });

    it('should return service codes from FIRS API', async () => {
      const mockData = [
        { id: '1', code: 'S001', description: 'Professional Services', category: 'Business Services' },
      ];
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await service.getServiceCodes();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.firs.gov.ng/services-codes');
    });
  });

  describe('getLocalGovernments', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue('https://api.firs.gov.ng');
    });

    it('should return local governments from FIRS API', async () => {
      const mockData = [
        { id: '1', name: 'Abuja Municipal', code: 'FCT001', stateId: 'FCT', stateName: 'Federal Capital Territory' },
      ];
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await service.getLocalGovernments();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.firs.gov.ng/lgas');
    });
  });

  describe('getStateCodes', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue('https://api.firs.gov.ng');
    });

    it('should return state codes from FIRS API', async () => {
      const mockData = [
        { id: '1', name: 'Abia', code: 'AB', countryId: 'NG' },
      ];
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await service.getStateCodes();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.firs.gov.ng/states');
    });
  });
}); 