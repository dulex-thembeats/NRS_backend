"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFirsQrCode = generateFirsQrCode;
const crypto = require("crypto");
const common_1 = require("@nestjs/common");
function getPublicKeyPem() {
    const base64Key = process.env.FIRS_PUBLIC_KEY_BASE64;
    if (!base64Key) {
        throw new common_1.InternalServerErrorException("Missing FIRS_PUBLIC_KEY_BASE64 env variable");
    }
    return Buffer.from(base64Key, "base64").toString("utf-8");
}
function encryptPayload(payload) {
    const publicKeyPem = getPublicKeyPem();
    const encryptedBuffer = crypto.publicEncrypt({
        key: publicKeyPem,
        padding: crypto.constants.RSA_PKCS1_PADDING,
    }, Buffer.from(JSON.stringify(payload)));
    return encryptedBuffer.toString("base64");
}
function generateFirsQrCode(irn) {
    const certificate = process.env.FIRS_CERTIFICATE_BASE64;
    if (!certificate) {
        throw new common_1.InternalServerErrorException("Missing FIRS_CERTIFICATE_BASE64 env variable");
    }
    const payload = {
        irn,
        certificate,
    };
    const encryptedBase64 = encryptPayload(payload);
    return encryptedBase64;
}
//# sourceMappingURL=firs-qr-code.helper.js.map