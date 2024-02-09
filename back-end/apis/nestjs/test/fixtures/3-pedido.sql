INSERT INTO
    "cliente" (
        "id",
        "nome",
        "cpf",
        "email"
    )
VALUES
    (
        DEFAULT,
        'Jose da Silva',
        '12345678909',
        'email@test.com'
    );

INSERT INTO
    "item_cardapio" (
        "id",
        "nome",
        "descricao",
        "categoria",
        "preco"
    )
VALUES
    (
        DEFAULT,
        'item_teste',
        'descricao_teste',
        1,
        'R$1.00'
    );

INSERT INTO
    "item_pedido" (
        "id",
        "quantidade",
        "item",
        "createdAt"
    )
VALUES
    (
        "a2b3c4d5-1234-5678-9abc-def012345678",
        1,
        (SELECT id FROM item_cardapio WHERE nome = 'item_teste'),
        NOW()
    );

INSERT INTO
    "pedido_protocolado" (
        "id",
        "cliente",
        "pedido",
        "status",
        "createdAt",
        "receivedAt",
        "preparedAt",
        "doneAt"
    )
VALUES
    (
        DEFAULT,
        (SELECT id FROM cliente WHERE nome = 'Jose da Silva'),
        (SELECT id FROM item_pedido WHERE id = 'a2b3c4d5-1234-5678-9abc-def012345678'),
        1,
        NOW(),
        NOW(),
        NOW(),
        NOW()
    );



