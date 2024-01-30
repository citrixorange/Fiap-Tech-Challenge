import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

import {
    ICheckout,
    QrCodeGenRequest,
    QrCodeGenResponse,
    FakeCheckoutRequest,
    FakeCheckoutResponse
} from "../../../core/applications/ports/checkout.interface";

import {
    PaymentGateway
} from "../../../core/domain/payments.interface";

@Injectable()
export class PagBankGateway implements ICheckout {

    config: any;
    bearer_token: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {

        const filePath = path.resolve(__dirname, '../../../../../config.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        this.config = JSON.parse(fileContent);
        this.bearer_token = this.configService.get<string>('PAG_BANK_SANDBOX_BEARER_TOKEN');

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
                throw new Error(this.config["errors"]["messages"]["preco_invalido"]);
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
                "name": request.pedido.cliente != undefined ? request.pedido.cliente.nome : process.env.NODE_ENV == 'prod' ? this.config["PagBank"]["production"]["cliente_anonimo"]["nome"] : this.config["PagBank"]["sandbox"]["cliente_anonimo"]["nome"],
                "email": request.pedido.cliente != undefined ? request.pedido.cliente.email : process.env.NODE_ENV == 'prod' ? this.config["PagBank"]["production"]["cliente_anonimo"]["email"] : this.config["PagBank"]["sandbox"]["cliente_anonimo"]["email"],
                "tax_id": request.pedido.cliente != undefined ? request.pedido.cliente.cpf : process.env.NODE_ENV == 'prod' ? this.config["PagBank"]["production"]["cliente_anonimo"]["cpf"] : this.config["PagBank"]["sandbox"]["cliente_anonimo"]["cpf"],
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
            let base_url = process.env.NODE_ENV == 'prod' ? this.config["PagBank"]["production"]["url"] : this.config["PagBank"]["sandbox"]["url"];
            let order_page = process.env.NODE_ENV == 'prod' ? this.config["PagBank"]["production"]["order_page"] : this.config["PagBank"]["sandbox"]["order_page"];

            const header = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
    
            let result = await this.httpService.axiosRef.post(
                base_url + order_page,
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
        let base_url = process.env.NODE_ENV == 'prod' ? this.config["PagBank"]["production"]["url"] : this.config["PagBank"]["sandbox"]["url"];
        let checkout_page = process.env.NODE_ENV == 'prod' ? this.config["PagBank"]["production"]["fake_checkout_page"] : this.config["PagBank"]["sandbox"]["fake_checkout_page"];

        const header = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }

        let response = await this.httpService.post(
            base_url + checkout_page + '/' + request.orderId,
            {},
            {
                headers: header
            }
        );

        return this.formatFakeCheckoutResponse(response);
    }
}