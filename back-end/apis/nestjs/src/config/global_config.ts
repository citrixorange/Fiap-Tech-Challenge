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
    "max_order_quantity": 30,
    "errors": {
        "status_code": {
            "categoria_invalida": "BAD_REQUEST",
            "preco_invalido": "BAD_REQUEST",
            "item_cardapio_duplicado": "CONFLICT",
            "item_cardapio_nao_encontrado": "NOT_FOUND",
            "novo_campo_ausente": "BAD_REQUEST",
            "cliente_nao_encontrado": "NOT_FOUND",
            "cliente_duplicado": "CONFLICT",
            "identificador_ausente": "BAD_REQUEST",
            "pedido_nao_encontrado": "NOT_FOUND",
            "bad_request": "BAD_REQUEST",
            "unexpected_error": "INTERNAL_SERVER_ERROR",
            "quantidade_maxima_excedida": "BAD_REQUEST"
        },
        "messages": {
            "categoria_invalida": "Categoria Inválida. Por favor consulte a documentação.",
            "preco_invalido": "Preço Inválido",
            "item_cardapio_duplicado": "Item Duplicado no Cardápio",
            "item_cardapio_nao_encontrado": "Item não encontrado no Cardápio",
            "novo_campo_ausente": "Por favor, informe ao menos um campo a ser editado: nome, descrição, categoria ou preço.",
            "cliente_nao_encontrado": "Cliente não encontrado",
            "cliente_duplicado": "Cliente já se encontrado cadastrado na Plataforma",
            "identificador_ausente": "Por favor, informe ao menos um identificador: nome, cpf ou email.",
            "pedido_nao_encontrado": "Pedido não encontrado.",
            "bad_request": "Bad Request.",
            "unexpected_error": "Unexpected Error.",
            "quantidade_maxima_excedida": "Quantidade Superior a permitida."
        }
    }
};

export {
    config
};