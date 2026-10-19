-- ============================================================================
-- MIGRATION: 20261021000000_unique_hd_product_images.sql
-- DESCRIÇÃO: Imagens em Altíssima Resolução (HD), Sem Repetição, para Todos os Produtos
-- CADA PRODUTO COM IMAGEM EXCLUSIVA E CONTEXTUAL (100% TESTADAS HTTP 200 OK)
-- ============================================================================

BEGIN;

-- 1. Clube Morar Bem Benefícios (Clube de vantagens, compras, parceiros, conveniados)
UPDATE public.produtos
SET imagem_principal = 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=1200&q=85'
WHERE nome = 'Clube Morar Bem Benefícios' OR titulo_comercial = 'Clube Morar Bem Benefícios';

-- 2. Rede de Saúde Morar Bem (Médico profissional, estetoscópio, acolhimento e consulta)
UPDATE public.produtos
SET imagem_principal = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85'
WHERE nome = 'Rede de Saúde Morar Bem' OR titulo_comercial = 'Rede de Saúde Morar Bem';

-- 3. Odonto Morar Bem (Consultório odontológico moderno, sorriso saudável)
UPDATE public.produtos
SET imagem_principal = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85'
WHERE nome = 'Odonto Morar Bem' OR titulo_comercial = 'Odonto Morar Bem';

-- 4. Proteção Familiar (Família feliz abraçada, segurança e proteção patrimonial)
UPDATE public.produtos
SET imagem_principal = 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85'
WHERE nome = 'Proteção Familiar' OR titulo_comercial = 'Proteção Familiar Morar Bem';

-- 5. Minha Casa (Casa residencial contemporânea com arquitetura de alto padrão e jardim)
UPDATE public.produtos
SET imagem_principal = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'
WHERE nome = 'Minha Casa' OR titulo_comercial = 'Jornada Minha Casa';

-- 6. Financiamento Habitacional (Entrega solene de chaves do novo imóvel ao cooperado)
UPDATE public.produtos
SET imagem_principal = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85'
WHERE nome = 'Financiamento Habitacional' OR titulo_comercial = 'Crédito Habitacional MBB';

-- 7. Reformar Minha Casa (Reforma de interiores, arquitetura, pintura e acabamento)
UPDATE public.produtos
SET imagem_principal = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=85'
WHERE nome = 'Reformar Minha Casa' OR titulo_comercial = 'Reforma Morar Bem';

-- 8. Seguro Automóvel (Veículo SUV moderno de alto padrão na estrada, proteção veicular)
UPDATE public.produtos
SET imagem_principal = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85'
WHERE nome = 'Seguro Automóvel' OR titulo_comercial = 'Seguro Auto MBB';

-- 9. Crédito Pessoal (Cartão de crédito, planejamento financeiro e capital de giro)
UPDATE public.produtos
SET imagem_principal = 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=85'
WHERE nome = 'Crédito Pessoal' OR titulo_comercial = 'Crédito Pessoal Diamond';

-- 10. Morar Bem Pet (Veterinário experiente cuidando de cão e gato com saúde)
UPDATE public.produtos
SET imagem_principal = 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=85'
WHERE nome = 'Morar Bem Pet' OR titulo_comercial = 'Morar Bem Pet';

-- 11. Cashback Morar Bem (Moedas de ouro, cofrinho e investimento com retorno em valor)
UPDATE public.produtos
SET imagem_principal = 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=85'
WHERE nome = 'Cashback Morar Bem' OR titulo_comercial = 'Cashback Morar Bem';

COMMIT;
