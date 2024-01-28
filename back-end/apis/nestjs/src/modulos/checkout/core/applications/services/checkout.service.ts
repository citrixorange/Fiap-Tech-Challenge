import { Inject } from "@nestjs/common";

import {
    ICheckout,
    QrCodeGenRequest,
    QrCodeGenResponse,
    FakeCheckoutRequest,
    FakeCheckoutResponse
} from "../ports/checkout.interface";

export class CheckoutService {
    
    constructor(
        @Inject('ICheckout')
        private readonly checkoutProvider: ICheckout
    ) {}

    async gerarQrCodePix(request: QrCodeGenRequest): Promise<QrCodeGenResponse> {
        return this.checkoutProvider.gerarQrCodePix(request);
    }

    async fakeCheckout(request: FakeCheckoutRequest): Promise<FakeCheckoutResponse> {
        return this.checkoutProvider.fakeCheckout(request);
    }
}