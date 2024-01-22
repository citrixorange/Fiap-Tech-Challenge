# Dicionário Linguagem Ubíqua Tech Challenge


**Cliente:** Usuários Principais do Sistema que farão pedidos ao restaurante via plataforma automatizada. 

**Cadastro do Cliente:** Procedimento Opcional ao qual Cliente se Cadastra na Plataforma do Restaurante informando: 
- Nome Completo 
- CPF
- email e 
- possivelmente informações adicionais como permissão para receber anúncios e etc…

**Identificação do Cliente:** Procedimento ao qual o cliente informa seu CPF, Nome ou email para se identificar para a plataforma.

**Item do Cardápio:** Item dotado dos seguintes atributos:
- Título
- Descrição
- Categoria: {Lanche, Acompanhamento, Bebida, Sobremesa}
- Preço
- Status de Disponibilidade: {Disponível, Indisponível}

**Cardápio:** Coleção de Itens disponíveis para os clientes selecionarem no Pedido.

**Pedido:** Pedido criado pelo Cliente contendo um ou mais Itens do Cardápio.

**Totem de Autoatendimento:** Dispositivo de Auto-Atendimento utilizado pelos Clientes para realizar Pedidos.

**Número de Protocolo do Pedido:** Número Único designado para os Pedidos Confirmados e Pagos. 

**Ticket do Pedido:** Ticket Impresso para o Cliente após a confirmação do pagamento no Totem de Autoatendimento contendo o Número de Protocolo e Descrição do Pedido.

**Status do Pedido:**
- *Recebido:* Pedido Confirmado e Pago.
- *Em preparação:* Pedido recebido pelo cozinheiro.
- *Pronto:* Pedido preparado pelo cozinheiro e disponível para entrega. 
- *Finalizado:* Pedido Recebido pelo Cliente.

**Monitor de Acompanhamento do Pedido:** Interface Gráfica que Lista os Pedidos dos Clientes com seus respectivos Status.

**Acompanhamento do Pedido:** ato de acompanhar o Status do Pedido através do Monitor de Acompanhamento do Pedido. 

**Checkout:** Etapa do pagamento do pedido. Serviço Externo podendo ser dotado de um ou mais métodos de pagamento:
- Qr Code (Pix)
- …
 
**Fila de Pedidos:** Fila de Pedidos Protocolados. A inserção de um pedido na Fila de Pedidos ocorre logo após o pedido ser confirmado e pago pelo cliente.

**Cozinheiro:** Profissional responsável pelo Preparo do Pedido. O cozinheiro receberá o Pedido do Cliente através da Fila de Pedidos.

**Preparo:** Etapa no qual o cozinheiro prepara o pedido. Nessa etapa o status do pedido é ‘Em preparação’.

**Monitor da Cozinha:** Interface Gráfica ao qual o cozinheiro recebe os Pedidos dos Clientes. O cozinheiro deve estar logado no sistema para acessá-lo.

**Gerente:** Profissional Responsável pela Operação do Restaurante. O Gerente pode ter acesso Administrativo a Plataforma de Automação.

**Entrega:** Etapa no qual o cozinheiro terminou o preparo do pedido e deixou o mesmo disponível para a entrega para o cliente. Nessa etapa o status do pedido é ‘pronto’.

**Painel do Administrador:** Interface Gráfica para Administrador do Sistema. Nível máximo de restrição de acesso. Interface usada pelo Administrador para:
- Criar/Editar Itens.
- ...