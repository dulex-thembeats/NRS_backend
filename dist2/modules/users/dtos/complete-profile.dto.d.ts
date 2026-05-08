import { DirectorDto } from "./register-user.dto";
export declare class CompleteProfileDto {
    entityId: string;
    businessName: string;
    businessAddress: string;
    rcNumber: string;
    dateOfIncorporation?: string;
    directors: DirectorDto[];
}
