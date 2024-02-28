import { Inject } from "@nestjs/common";

import {
    ICheckout,
    QrCodeGenRequest,
    QrCodeGenResponse,
    FakeCheckoutRequest,
    FakeCheckoutResponse,
    ConsultaPagamentoRequest,
    ConsultaPagamentoResponse,
    EstornoRequest,
    EstornoResponse,
    NotificationRequest
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

    async consultarPagamento(request: ConsultaPagamentoRequest): Promise<ConsultaPagamentoResponse> {
        return this.checkoutProvider.consultarPagamento(request);
    }

    async estornarCompra(request: EstornoRequest): Promise<EstornoResponse> {
        return this.checkoutProvider.estornarCompra(request);
    }

    async webhookNotification(request: NotificationRequest) {
        this.checkoutProvider.webhookNotification(request);
    }
}