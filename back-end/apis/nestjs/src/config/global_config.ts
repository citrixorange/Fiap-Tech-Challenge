const config = {
    "App": {
        "title": "Tech Challenge Api Server",
        "description": "A Fast Food Back-End API Server",
        "version": "v1.0",
        "tag": "módulo 1"
    },
    "Swagger": {
        "api_route": "api"
    },
    "PagBank": {
        "sandbox": {
            "url": "https://sandbox.api.pagseguro.com",
            "order_page": "/orders",
            "fake_checkout_page": "/pix/pay/",
            "cliente_anonimo": {
                "nome": "Cliente Anônimo",
                "email": "no_email_provided@test.com",
                "cpf": "12345678909"
            }
        },
        "production": {
            "url": "https://api.pagseguro.com",
            "order_page": "/orders",
            "checkout_page": "/pix/pay/",
            "cliente_anonimo": {
                "nome": "Cliente Anônimo",
                "email": "no_email_provided@test.com",
                "cpf": "12345678909"
            }
        }
    },
    "errors": {
        "messages": {
            "preco_invalido": "Preço Inválido",
            "item_cardapio_nao_encontrado": "Item não encontrado no Cardápio",
            "novo_campo_ausente": "Por favor, informe ao menos um campo a ser editado: nome, descrição, categoria ou preço.",
            "cliente_nao_encontrado": "Cliente não encontrado",
            "identificador_ausente": "Por favor, informe ao menos um identificador: nome, cpf ou email.",
            "pedido_nao_encontrado": "Pedido não encontrado.",
            "bad_request": "Bad Request."

        }
    }
};

export {
    config
};