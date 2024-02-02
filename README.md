# Fiap-Tech-Challenge

This Project is part of Fiap Software Architeture Specialization Program. It should follows best practice on Software Architecture to provide Back-End for a Self-Service Fast Food Establishment

Check more at: https://github.com/citrixorange/Fiap-Tech-Challenge

# Api Documentation

Api Doc is available by Swagger(Run Containers as Dev Mode, and check: http://localhost:3000/api)

Criar Pedido receives any object, cause it should be called direct by PagBank Webhook when a fake payment is done.
Use the following payload as a valid example:

```
{
    "id": "ORDE_F87334AC-BB8B-42E2-AA85-8579F70AA328",
    "reference_id": "ex-00004",
    "created_at": "2020-11-21T23:23:22.69-03:00",
    "shipping": {
        "address": {
            "street": "Avenida Brigadeiro Faria Lima",
            "number": "1384",
            "complement": "apto 12",
            "locality": "Pinheiros",
            "city": "São Paulo",
            "region_code": "SP",
            "country": "BRA",
            "postal_code": "01452002"
        }
    },
    "items": [
        {
            "reference_id": "referencia do item",
            "name": "item_teste1",
            "quantity": 1,
            "unit_amount": 1
        },
        {
            "reference_id": "referencia do item",
            "name": "item_teste1",
            "quantity": 2,
            "unit_amount": 3
        }
    ],
    "customer": {
        "name": "Manoel",
        "email": "emai@test.com",
        "tax_id": "12342175909",
        "phones": [
            {
                "country": "55",
                "area": "11",
                "number": "999999999",
                "type": "MOBILE"
            }
        ]
    },
    "charges": [
        {
            "id": "CHAR_F1F10115-09F4-4560-85F5-A828D9F96300",
            "reference_id": "referencia da cobranca",
            "status": "PAID",
            "created_at": "2020-11-21T23:30:22.695-03:00",
            "paid_at": "2020-11-21T23:30:24.352-03:00",
            "description": "descricao da cobranca",
            "amount": {
                "value": 500,
                "currency": "BRL",
                "summary": {
                    "total": 500,
                    "paid": 500,
                    "refunded": 0
                }
            },
            "payment_response": {
                "code": "20000",
                "message": "SUCESSO",
                "reference": "1606012224352"
            },
            "payment_method": {
                "type": "PIX",
                "holder": {
                        "name": "Francisco da Silva",
                        "tax_id": "***534218**"
                }
            },
            "links": [
                {
                    "rel": "SELF",
                    "href": "https://sandbox.api.pagseguro.com/charges/CHAR_F1F10115-09F4-4560-85F5-A828D9F96300",
                    "media": "application/json",
                    "type": "GET"
                },
                {
                    "rel": "CHARGE.CANCEL",
                    "href": "https://sandbox.api.pagseguro.com/charges/CHAR_F1F10115-09F4-4560-85F5-A828D9F96300/cancel",
                    "media": "application/json",
                    "type": "POST"
                }
            ]
        }
    ],
    "qr_code": [
        {
            "id": "QRCO_86FE511B-E945-4FE1-BB5D-297974C0DB74",
            "amount": {
                "value": 500
            },
            "text": "00020101021226600016BR.COM.PAGSEGURO013686FE511B-E945-4FE1-BB5D-297974C0DB7452048999530398654045.005802BR5922Rafael Gouveia Firmino6009SAO PAULO63049879",
            "links": [
                {
                    "rel": "QRCODE.PNG",
                    "href": "https://sandbox.api.pagseguro.com/qrcode/QRCO_86FE511B-E945-4FE1-BB5D-297974C0DB74/png",
                    "media": "image/png",
                    "type": "GET"
                },
                {
                    "rel": "QRCODE.BASE64",
                    "href": "https://sandbox.api.pagseguro.com/qrcode/QRCO_86FE511B-E945-4FE1-BB5D-297974C0DB74/base64",
                    "media": "text/plain",
                    "type": "GET"
                }
            ]
        }
    ],
    "links": [
        {
            "rel": "SELF",
            "href": "https://sandbox.api.pagseguro.com/orders/ORDE_F87334AC-BB8B-42E2-AA85-8579F70AA328",
            "media": "application/json",
            "type": "GET"
        },
        {
            "rel": "PAY",
            "href": "https://sandbox.api.pagseguro.com/orders/ORDE_F87334AC-BB8B-42E2-AA85-8579F70AA328/pay",
            "media": "application/json",
            "type": "POST"
        }
    ]
}
```

# Protobuf 

One Goal of Port and Adapter Pattern is preserving business rules (abstract classes) untouch from low level details from implementation classes.
However it should not be achieve when interface defined by core (business rules) is not stable. In such situation, if an interface from business rules changes, this change is propagated by dependencies, what makes software get broken and demmands re-work (what is definetelly undesired by anyone).

As having a stable Interface is not considering something easy to achieve, i decide to choose Protobuf for the following reasons:

a. Protobuf can be used to define interface agnostic by any Programming Language. When we define an interface as a .proto file, the interface can be
used in any Programming Language: Java, C++, Javascript, Typescript, Rust, Go, Python...

b. Protobuf is designed to preserve backward & forward compatibility. Is possible by following all good practices from Protobuf,
change interface however keeping dependencies which uses older interface version working without any break. The same behaviour is possible  
when dependencie already implements new interface, meanwhile the dependency itself doesn't!

Check more about it here: https://protobuf.dev/overview/

# Instructions to run locally

docker build .
cd ./back-end/apis/nestjs/environment/dev
docker-compose up

