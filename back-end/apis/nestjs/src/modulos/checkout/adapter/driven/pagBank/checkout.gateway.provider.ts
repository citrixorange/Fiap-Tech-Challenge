import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import {
    ICheckout,
    QrCodeGenRequest,
    QrCodeGenResponse,
    FakeCheckoutRequest,
    FakeCheckoutResponse
} from "../../../core/applications/ports/checkout.interface";

import {
    PaymentGateway
} from "../../../core/domain/payments";

@Injectable()
export class PagBankGateway implements ICheckout {

    base_url: string;
    order_page: string;
    fake_checkout_page: string;
    bearer_token: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.bearer_token = this.configService.get<string>('PAG_BANK_SANDBOX_BEARER_TOKEN');
        this.base_url = "https://sandbox.api.pagseguro.com";
        this.order_page = "/orders";
        this.fake_checkout_page = "/pix/pay/";
    }

    parsePrice(price: string): number {
        const numericString = price.replace(/[^\d]/g, '');
        const result = parseInt(numericString, 10);
        return result;
    }

    formatPrice(price:string): string {
        
        try {
            const numericValue = parseFloat(price);

            if (isNaN(numericValue)) {
                throw new Error('Invalid price');
            }
    
            const currencyString = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
            }).format(numericValue);
    
            return currencyString;

        } catch(err) {
            console.log("Error: " + err);
            return err;
        };
    }

    totalAmount(request: QrCodeGenRequest):number {
        return request.pedido.pedido.item.map((item) => {
            return item.quantidade*this.parsePrice(item.preco);
        }).reduce((acc, amount) => {
            return acc + amount;
        }, 0)
    }

    formatBodyRequest(request: QrCodeGenRequest): any {

        return {
            "reference_id": "ex-00001",
            "customer": {
                "name": request.pedido.cliente.nome,
                "email": request.pedido.cliente.email,
                "tax_id": request.pedido.cliente.cpf,
                "phones": [
                    {
                        "country": "+55",
                        "area": "11",
                        "number": "999999999",
                        "type": "MOBILE"
                    }
                ],
            },
            "items": request.pedido.pedido.item.map(item => {
                return {
                    "name": item.nome,
                    "quantity": item.quantidade,
                    "unit_amount": this.parsePrice(item.preco)
                };
            }),
            "qr_codes": [
                {
                    "amount": {
                        "value": this.totalAmount(request)
                    },
                    "expiration_date": "2024-01-28T20:15:59-03:00"
                }
            ],
            "shipping": {
                "address": {
                    "street": "Rua Juquitibá",
                    "number": "53",
                    "complement": "53",
                    "locality": "Vila Prado",
                    "city": "São Carlos",
                    "region_code": "SP",
                    "country": "BRA",
                    "postal_code": "01452002"
                }
            },
            "notifications_urls": [
                ""
            ]
        };
    }

    formatQrCodeResponse(response: any): QrCodeGenResponse {

        try {

            let formattedResponse: QrCodeGenResponse = {
                gateway: PaymentGateway.PAG_SEGURO,
                qrCodeId: response.id,
                pedido: response.items.map(item => {
                    return {
                        nome: item.name,
                        quantidade: item.quantity,
                        preco: this.formatPrice(item.unit_amount)
                    }
                }),
                totalAmount: response.qr_codes[0].amount.value,
                expirationData: response.qr_codes[0].expiration_date,
                qrCodeText: response.qr_codes[0].text,
                qrCodePngLink: response.qr_codes[0].links.filter(link => link.media == "image/png")[0],
                qrCodeBase64Link: response.qr_codes[0].links.filter(link => link.media == "text/plain")[0]
            };
    
            return formattedResponse;

        } catch(err) {
            console.log(err);
            return err;
        };
        
    }

    formatFakeCheckoutResponse(response: any): FakeCheckoutResponse {
        let formatted_response: FakeCheckoutResponse;
        return formatted_response;
    }

    async gerarQrCodePix(request: QrCodeGenRequest): Promise<QrCodeGenResponse> {

        try {
            
            let token = this.bearer_token;

            const header = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
    
            let result = await this.httpService.axiosRef.post(
                this.base_url + this.order_page,
                this.formatBodyRequest(request),
                {
                    headers: header
                }
            );
            
            const body = result.data;
            const responseStatus = result.status;
    
            if(responseStatus == 404) {
                throw BadRequestException;
            } else if(responseStatus != 201) {
                throw InternalServerErrorException;
            } else {
                return this.formatQrCodeResponse(body);
            }

        } catch(err) {
            console.log(err);
            throw InternalServerErrorException;
        }

    }

    async fakeCheckout(request: FakeCheckoutRequest): Promise<FakeCheckoutResponse> {
        
        let token = this.bearer_token;

        const header = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }

        let response = await this.httpService.post(
            this.base_url + this.fake_checkout_page + '/' + request.orderId,
            {},
            {
                headers: header
            }
        );

        return this.formatFakeCheckoutResponse(response);
    }
}