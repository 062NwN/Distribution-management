function FilterProducts(produtos, filtros) {
    const {
        busca,
        busca2,
        nome,
        codeBar,
        sku,
        categoria,
        status
    } = filtros;

    return produtos.filter((produto) => {

        if (
            categoria &&
            produto.categoria !== categoria
        ) {
            return false;
        }

        if (
            status &&
            produto.status !== status
        ) {
            return false;
        }

        if (
            nome &&
            produto.nome !== nome
        ) {
            return false;
        }

        if (
            codeBar &&
            produto.codeBar !== codeBar
        ) {
            return false;
        }

        if (
            sku &&
            produto.sku !== sku
        ) {
            return false;
        }

        if (busca) {
            const texto = busca.toLowerCase();

            const correspondeBusca =
                produto.nome?.toLowerCase().includes(texto) ||
                produto.sku?.toLowerCase().includes(texto) ||
                produto.codigo_barras?.toLowerCase().includes(texto) ||
                produto.categoria?.toLowerCase().includes(texto) ||
                produto.subcategoria?.toLowerCase().includes(texto);

            if (!correspondeBusca) {
                return false;
            }
        }

        if (busca2) {
            const texto = busca2.toLowerCase();

            const correspondeBusca =
                produto.nome?.toLowerCase().includes(texto) ||
                produto.sku?.toLowerCase().includes(texto) ||
                produto.codigo_barras?.toLowerCase().includes(texto);

            if (!correspondeBusca) {
                return false;
            }
        }

        return true;
    });
}

export default FilterProducts;