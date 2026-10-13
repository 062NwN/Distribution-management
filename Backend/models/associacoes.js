const Produto = require('./produto');
const MovimentacaoEstoque = require('./MovimentacaoEstoque');
const Venda = require('./venda');
const VendaItem = require('./vendaItem');

Venda.hasMany(VendaItem, { foreignKey: 'venda_id', as: 'itens', onDelete: 'CASCADE' });
VendaItem.belongsTo(Venda, { foreignKey: 'venda_id' });

Produto.hasMany(VendaItem, { foreignKey: 'produto_id', onDelete: 'SET NULL' });
VendaItem.belongsTo(Produto, { foreignKey: 'produto_id' });

Produto.hasMany(MovimentacaoEstoque, { foreignKey: 'produto_id', onDelete: 'SET NULL' });
MovimentacaoEstoque.belongsTo(Produto, { foreignKey: 'produto_id' });