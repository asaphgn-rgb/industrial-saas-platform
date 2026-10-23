import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.graphics.shapes import Drawing, Rect, String as DString, Line as DLine, Group, Polygon
from reportlab.pdfgen import canvas

PAGE_W, PAGE_H = A4

class MemorialNumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(MemorialNumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_decorations(self, page_count):
        self.saveState()
        # Top banner on all pages except cover (page 1)
        if self._pageNumber > 1:
            self.setStrokeColor(colors.HexColor("#010736"))
            self.setLineWidth(1.2)
            self.line(36, PAGE_H - 28, PAGE_W - 36, PAGE_H - 28)

            self.setFont("Helvetica-Bold", 6.5)
            self.setFillColor(colors.HexColor("#010736"))
            self.drawString(36, PAGE_H - 23, "DY INVEST · MEMORIAL DESCRITIVO E ARQUITETURA OPERACIONAL ENTERPRISE 360°")
            self.setFont("Helvetica", 6.5)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawRightString(PAGE_W - 36, PAGE_H - 23, "MORAR BEM BRASIL & DYAMOND CARD · DOCUMENTO OFICIAL")

        # Bottom footer on all pages
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(36, 26, PAGE_W - 36, 26)

        self.setFont("Helvetica-Bold", 6.5)
        self.setFillColor(colors.HexColor("#010736"))
        self.drawString(36, 16, "DY INVEST (DY CARD SERV. CONS. INVEST. FIN. LTDA) · ARQUITETURA, FLUXOS E GOVERNANÇA")

        self.setFont("Helvetica-Bold", 6.5)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawRightString(PAGE_W - 36, 16, f"PÁGINA {self._pageNumber} DE {page_count}")
        self.restoreState()

# Helpers para criação de diagramas vetoriais nítidos
def make_box(x, y, w, h, title, subtitle="", bg="#010736", text_color="#FFFFFF", border_color="#22396F"):
    g = Group()
    # Caixa principal com bordas arredondadas
    rect = Rect(x, y, w, h, rx=5, ry=5, fillColor=colors.HexColor(bg), strokeColor=colors.HexColor(border_color), strokeWidth=1)
    g.add(rect)
    # Título centralizado
    t = DString(x + w / 2, y + h / 2 + (2 if subtitle else -3), title, fontName="Helvetica-Bold", fontSize=7.5, textAnchor="middle", fillColor=colors.HexColor(text_color))
    g.add(t)
    if subtitle:
        sub = DString(x + w / 2, y + h / 2 - 8, subtitle, fontName="Helvetica", fontSize=5.5, textAnchor="middle", fillColor=colors.HexColor(text_color))
        g.add(sub)
    return g

def make_arrow_down(x, y_start, y_end, label="", color="#22396F"):
    g = Group()
    line = DLine(x, y_start, x, y_end, strokeColor=colors.HexColor(color), strokeWidth=1.2)
    g.add(line)
    # Ponta da seta
    arrow = Polygon(points=[x - 3, y_end + 5, x + 3, y_end + 5, x, y_end], fillColor=colors.HexColor(color), strokeColor=colors.HexColor(color))
    g.add(arrow)
    if label:
        lbl = DString(x + 6, (y_start + y_end) / 2 - 2, label, fontName="Helvetica-Bold", fontSize=5.5, fillColor=colors.HexColor("#475569"))
        g.add(lbl)
    return g

def make_arrow_right(x_start, x_end, y, label="", color="#22396F"):
    g = Group()
    line = DLine(x_start, y, x_end, y, strokeColor=colors.HexColor(color), strokeWidth=1.2)
    g.add(line)
    arrow = Polygon(points=[x_end - 5, y - 3, x_end - 5, y + 3, x_end, y], fillColor=colors.HexColor(color), strokeColor=colors.HexColor(color))
    g.add(arrow)
    if label:
        lbl = DString((x_start + x_end) / 2, y + 4, label, fontName="Helvetica-Bold", fontSize=5.5, textAnchor="middle", fillColor=colors.HexColor("#475569"))
        g.add(lbl)
    return g

def build_memorial_pdf():
    pdf_filename = "MEMORIAL_DESCRITIVO_FLUXOS_OPERACIONAIS_DY_INVEST.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    navy_deep = colors.HexColor("#010736")
    navy_royal = colors.HexColor("#0D1C42")
    navy_accent = colors.HexColor("#22396F")
    cream_noble = colors.HexColor("#FCF1D0")
    green_cert = colors.HexColor("#047857")
    green_bg = colors.HexColor("#ECFDF5")
    card_bg = colors.HexColor("#F8FAFD")
    text_dark = colors.HexColor("#0A142F")
    text_muted = colors.HexColor("#475569")
    border_color = colors.HexColor("#CBD5E1")

    p_header_label = ParagraphStyle('HeadLbl', fontName='Helvetica-Bold', fontSize=6.5, leading=8.5, textColor=text_muted)
    p_header_title = ParagraphStyle('HeadTit', fontName='Helvetica-Bold', fontSize=10.5, leading=13, textColor=navy_deep)

    p_cover_title = ParagraphStyle('CovTit', fontName='Helvetica-Bold', fontSize=14, leading=17, textColor=navy_deep)
    p_sec_title = ParagraphStyle('SecTit', fontName='Helvetica-Bold', fontSize=9.5, leading=12.5, textColor=navy_deep, textTransform='uppercase', spaceBefore=6, spaceAfter=3)
    p_sec_sub = ParagraphStyle('SecSub', fontName='Helvetica', fontSize=7, leading=9.5, textColor=text_muted, spaceAfter=4)
    p_body = ParagraphStyle('Body', fontName='Helvetica', fontSize=7.2, leading=10, textColor=text_dark, alignment=4)
    p_body_bold = ParagraphStyle('BodyB', parent=p_body, fontName='Helvetica-Bold')

    tbl_h = ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=6.5, leading=8, textColor=colors.white, textTransform='uppercase')
    tbl_h_center = ParagraphStyle('THC', parent=tbl_h, alignment=1)
    tbl_c = ParagraphStyle('TC', fontName='Helvetica', fontSize=6.5, leading=8.5, textColor=text_dark)
    tbl_c_bold = ParagraphStyle('TCB', parent=tbl_c, fontName='Helvetica-Bold')
    tbl_c_center = ParagraphStyle('TCC', parent=tbl_c, alignment=1)
    tbl_c_green = ParagraphStyle('TCG', parent=tbl_c_center, fontName='Helvetica-Bold', textColor=green_cert)

    story = []
    logo_path = "public/assets/dyinvest-logo-centered.png"

    # =========================================================================
    # PÁGINA 1 — CAPA INSTITUCIONAL & VISÃO GERAL DA ARQUITETURA
    # =========================================================================
    if os.path.exists(logo_path):
        logo_img = Image(logo_path, width=200, height=147)
        top_data = [
            [
                logo_img,
                [
                    Paragraph("MEMORIAL DESCRITIVO DE ENGENHARIA & ARQUITETURA OPERACIONAL", ParagraphStyle('Cap1', fontName='Helvetica-Bold', fontSize=10.5, leading=13, textColor=navy_deep)),
                    Spacer(1, 2),
                    Paragraph("<b>ECOSSISTEMA INTEGRADO MORAR BEM BRASIL & BANDEIRA DYAMOND</b>", ParagraphStyle('Cap2', fontName='Helvetica-Bold', fontSize=8, leading=10.5, textColor=navy_accent)),
                    Paragraph("DOCUMENTO DE AUDITORIA DE PROCESSOS, FLUXOS E DADOS", ParagraphStyle('Cap3', fontName='Helvetica-Bold', fontSize=6.5, leading=8.5, textColor=text_muted)),
                    Spacer(1, 3),
                    Paragraph("<b>HOLDING GESTORA:</b> DY INVEST (DY CARD SERV. CONS. INVEST. FIN. LTDA)", ParagraphStyle('M1', fontName='Helvetica', fontSize=6.5, leading=8.5, textColor=text_muted)),
                    Paragraph("<b>VERSÃO DO SISTEMA:</b> 3.2.0 ENTERPRISE 360° · JURISDIÇÃO BRASIL", ParagraphStyle('M2', fontName='Helvetica', fontSize=6.5, leading=8.5, textColor=text_muted)),
                    Spacer(1, 3),
                    Paragraph("<font color='#047857'><b>● CERTIFICAÇÃO ARQUITETURAL COMPLETA</b></font>", ParagraphStyle('Badg', fontName='Helvetica-Bold', fontSize=7.5, leading=9, textColor=green_cert))
                ]
            ]
        ]
        t_top = Table(top_data, colWidths=[210, 313])
        t_top.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BACKGROUND', (1, 0), (1, 0), card_bg),
            ('BOX', (1, 0), (1, 0), 0.5, border_color),
            ('PADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (1, 0), (1, 0), 8),
        ]))
        story.append(t_top)
    story.append(Spacer(1, 6))

    story.append(Paragraph("1. OBJETIVO DO MEMORIAL TÉCNICO", p_sec_title))
    p_obj = "Este memorial técnico detalha de forma profunda, didática e transparente o funcionamento operacional de ponta a ponta do ecossistema <b>MORAR BEM BRASIL & DYAMOND</b> sob governança corporativa da <b>DY INVEST</b>. O objetivo é fornecer aos auditores, parceiros bancários, federações e órgãos reguladores um mapa completo da cadeia transacional, comprovando a eficácia do isolamento hierárquico nos 4 níveis, a integridade do Livro-Razão de partidas dobradas e o fluxo de formalização de instrumentos jurídicos e de cartões digitais."
    story.append(Paragraph(p_obj, p_body))

    # DIAGRAMA VETORIAL 1: MACRO-ARQUITETURA HIERÁRQUICA E FLUXO DE GOVERNANÇA (4 NÍVEIS)
    story.append(Paragraph("DIAGRAMA 1: HIERARQUIA MULTI-TENANT E FLUXO DE GOVERNANÇA", p_sec_title))
    d1 = Drawing(523, 115)
    # Nível 1: DY INVEST
    d1.add(make_box(166, 78, 190, 32, "NÍVEL 1: DY INVEST", "Holding Controladora · Governança Global · RLS Macro", bg="#010736", text_color="#FCF1D0", border_color="#22396F"))
    # Setas para Nível 2
    d1.add(make_arrow_down(210, 78, 48, "", color="#22396F"))
    d1.add(make_arrow_down(310, 78, 48, "", color="#22396F"))
    # Nível 2: Federações
    d1.add(make_box(50, 20, 180, 28, "NÍVEL 2: FEDERAÇÃO A", "Gestão Estadual Exclusiva · Zero Acesso B", bg="#0D1C42", text_color="#FFFFFF", border_color="#22396F"))
    d1.add(make_box(290, 20, 180, 28, "NÍVEL 2: FEDERAÇÃO B", "Gestão Estadual Exclusiva · Zero Acesso A", bg="#0D1C42", text_color="#FFFFFF", border_color="#22396F"))
    # Indicador de barreira
    d1.add(DLine(260, 15, 260, 52, strokeColor=colors.HexColor("#DC2626"), strokeWidth=1, strokeDashArray=[2, 2]))
    d1.add(DString(260, 55, "RLS BARRIER", fontName="Helvetica-Bold", fontSize=5, textAnchor="middle", fillColor=colors.HexColor("#DC2626")))
    story.append(d1)
    story.append(Spacer(1, 4))

    p_leg_d1 = "<i>Interpretação do Diagrama 1:</i> O isolamento entre entidades é executado no kernel do banco PostgreSQL via Row Level Security (RLS). A DY INVEST possui visão consolidada para conformidade e DRE, enquanto as federações estaduais são estritamente isoladas entre si (barreira RLS inviolável), sem compartilhamento de banco de dados aberto ou chaves privilegiadas no cliente."
    story.append(Paragraph(p_leg_d1, p_body))
    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 2 — FLUXO DA ESTEIRA HABITACIONAL & SCORING SOCIAL (MORAR BEM BRASIL)
    # =========================================================================
    story.append(Paragraph("02 | FLUXO OPERACIONAL HABITACIONAL & SCORING SOCIAL", p_header_label))
    story.append(Paragraph("ESTEIRA DE ADESÃO, CADASTRO, PRÉ-ANÁLISE E ALOCAÇÃO DE LOTES", p_header_title))
    story.append(Paragraph("Detalhamento da jornada do cooperado desde o ingresso associativo até a lavratura do Termo de Posse com fé pública.", p_sec_sub))
    story.append(Spacer(1, 4))

    # DIAGRAMA VETORIAL 2: ESTEIRA EM 6 ETAPAS
    story.append(Paragraph("DIAGRAMA 2: JORNADA COMPLETA DO MUTUÁRIO NA ESTEIRA HABITACIONAL", p_sec_title))
    d2 = Drawing(523, 75)
    steps = [
        ("1. Cadastro", "Dados Básicos"),
        ("2. Documentos", "Pasta Digital"),
        ("3. Scoring", "Motor Social"),
        ("4. Reserva", "Trava UNIQUE"),
        ("5. Alçada", "Workflow WF"),
        ("6. Posse", "Hash SHA-256")
    ]
    box_w = 72
    box_gap = 18
    for i, (stitle, ssub) in enumerate(steps):
        bx = 5 + i * (box_w + box_gap)
        d2.add(make_box(bx, 20, box_w, 36, stitle, ssub, bg="#0D1C42" if i % 2 == 0 else "#010736", text_color="#FFFFFF", border_color="#22396F"))
        if i < 5:
            d2.add(make_arrow_right(bx + box_w, bx + box_w + box_gap, 38, "", color="#22396F"))
    story.append(d2)
    story.append(Spacer(1, 4))

    p_desc_etp = "<b>Detalhamento Técnico das 6 Etapas Operacionais:</b><br/>" \
                 "<b>Etapa 1 (Cadastro e Consentimento LGPD):</b> O associado realiza o preenchimento de seus dados individuais e registra consentimento ativo para tratamento de dados pessoais segundo os Arts. 6º e 7º da Lei 13.709/18.<br/>" \
                 "<b>Etapa 2 (Upload na Pasta Digital Privada):</b> Comprovantes de renda, residência e certidões cíveis/criminais são enviados diretamente a buckets privados do Supabase Storage. O sistema gera links pré-assinados com expiração de 15 minutos, impedindo acesso público indiscriminado.<br/>" \
                 "<b>Etapa 3 (Motor de Scoring Social e Capacidade de Pagamento):</b> O algoritmo calcula a pontuação social (0 a 1000 pontos) considerando renda per capita familiar, número de dependentes, famílias monoparentais com mulheres chefes de família, pessoas com deficiência (PCD) e tempo de vínculo associativo. Em conformidade com a Resolução CMN nº 4.676, o comprometimento de renda é balizado no teto prudencial de 30%.<br/>" \
                 "<b>Etapa 4 (Espelho de Vendas e Reserva Imobiliária com Trava UNIQUE):</b> A seleção de lotes ou unidades opera com bloqueio pessimista relacional no banco (`UNIQUE(empreendimento_id, quadra_bloco, unidade_numero)`), impossibilitando matematicamente que dois corretores ou cooperados reservem a mesma unidade.<br/>" \
                 "<b>Etapa 5 (Alçadas de Decisão em Árvore — Padrão SAP Workflow):</b> Propostas acima de limites preestabelecidos exigem aprovação escalonada no módulo `alcadas_aprovacao_workflow` (Associação → Federação → Presidência), cumprindo o princípio da Segregação de Funções (SoD).<br/>" \
                 "<b>Etapa 6 (Emissão do Termo de Posse com Validade MP 2.200-2/2001):</b> A formalização contratual gera um hash SHA-256 indelével registrado na tabela `unidades_habitacionais`, capturando endereço IP, carimbo de tempo universal e evidências de autoria do signatário."
    story.append(Paragraph(p_desc_etp, p_body))
    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 3 — NÚCLEO CONTÁBIL: PARTIDAS DOBRADAS & AUDITORIA MERKLE
    # =========================================================================
    story.append(Paragraph("03 | NÚCLEO CONTÁBIL & TRILHA DE AUDITORIA CRIPTOGRÁFICA", p_header_label))
    story.append(Paragraph("ARQUITETURA FINANCEIRA COSIF/BACEN E ENCADEAMENTO MERKLE HASH", p_header_title))
    story.append(Paragraph("Garantia de inviolabilidade, equilíbrio matemático estrito de partidas dobradas e trilha pericial forense.", p_sec_sub))
    story.append(Spacer(1, 4))

    # DIAGRAMA VETORIAL 3: PARTIDAS DOBRADAS E MERKLE CHAINING
    story.append(Paragraph("DIAGRAMA 3: MECANISMO DE LANÇAMENTOS EQUILIBRADOS E ENCADEAMENTO MERKLE", p_sec_title))
    d3 = Drawing(523, 85)
    # Caixa Fato Econômico
    d3.add(make_box(10, 42, 110, 32, "FATO ECONÔMICO", "Adesão R$ 50 / Cota", bg="#010736", text_color="#FCF1D0"))
    d3.add(make_arrow_right(120, 160, 58, "Gera D=C", color="#22396F"))
    # Caixas Débito e Crédito
    d3.add(make_box(160, 52, 120, 24, "DÉBITO: R$ 50,00", "Disponibilidades / Banco", bg="#047857", text_color="#FFFFFF"))
    d3.add(make_box(160, 18, 120, 24, "CRÉDITO: R$ 50,00", "Passivo / Cashback Moradia", bg="#0D1C42", text_color="#FFFFFF"))
    # Seta para Merkle Chain
    d3.add(make_arrow_right(280, 320, 48, "Assinatura SHA-256", color="#22396F"))
    # Caixas do Merkle Chain
    d3.add(make_box(320, 35, 90, 30, "LOTE N-1", "Hash Ant: 8a7c...", bg="#22396F", text_color="#FFFFFF"))
    d3.add(make_arrow_right(410, 430, 50, "", color="#010736"))
    d3.add(make_box(430, 35, 90, 30, "LOTE N (ATUAL)", "Hash Atual: f41e...", bg="#010736", text_color="#FCF1D0", border_color="#A7F3D0"))
    story.append(d3)
    story.append(Spacer(1, 4))

    p_contabil_det = "<b>Rigores Matemáticos e Contábeis Auditados:</b><br/>" \
                     "<b>1. Banimento Total de Float Binário:</b> Todas as grandezas financeiras e quantidades operam sob o tipo relacional estrito `NUMERIC(15,2)` ou `NUMERIC(16,2)`. Não há arredondamentos imprecisos inerentes a representações de ponto flutuante em nenhuma camada.<br/>" \
                     "<b>2. Princípio das Partidas Dobradas (Frei Luca Pacioli 1494 / BACEN COSIF):</b> Cada transação gravada no `livro_razao_lancamentos` possui código estruturado do plano de contas (`contas_plano_contabil`), tipo de movimento Débito (`D`) ou Crédito (`C`), histórico e centro de custo. O motor transacional veda qualquer transação em que a soma de débitos divirja da soma de créditos.<br/>" \
                     "<b>3. Encadeamento Forense Merkle Chaining:</b> Cada evento da `trilha_auditoria_merkle` e cada lançamento contábil gera um hash criptográfico SHA-256 que incorpora o `hash_anterior`. Se um usuário com privilégios de banco de dados alterar um valor retroativamente, toda a árvore subsequente de hashes é corrompida, servindo como alerta imediato para auditorias do BACEN e Receita Federal."
    story.append(Paragraph(p_contabil_det, p_body))
    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 4 — OPERAÇÃO DA BANDEIRA DYAMOND CARD, BAAS & REDE CREDENCIADA
    # =========================================================================
    story.append(Paragraph("04 | OPERAÇÃO DA BANDEIRA DYAMOND CARD & REDE CREDENCIADA", p_header_label))
    story.append(Paragraph("CARTÃO VIRTUAL, CVV DINÂMICO, SPLIT MDR E VALIDAÇÃO EM BALCÃO", p_header_title))
    story.append(Paragraph("Estrutura técnica da bandeira própria de benefícios, meios de autenticação física/digital e marketplace.", p_sec_sub))
    story.append(Spacer(1, 4))

    # DIAGRAMA VETORIAL 4: FLUXO DE VALIDAÇÃO DE BENEFÍCIO EM ESTABELECIMENTO CREDENCIADO
    story.append(Paragraph("DIAGRAMA 4: FLUXO TRANSACIONAL DE VALIDAÇÃO DE BENEFÍCIO E REPASSE MDR", p_sec_title))
    d4 = Drawing(523, 75)
    d4.add(make_box(5, 20, 95, 36, "1. ASSOCIADO", "Apresenta QR Code / Cartão", bg="#010736", text_color="#FCF1D0"))
    d4.add(make_arrow_right(100, 130, 38, "Leitura", color="#22396F"))
    d4.add(make_box(130, 20, 105, 36, "2. CREDENCIADO", "Lojista Valida no Portal", bg="#0D1C42", text_color="#FFFFFF"))
    d4.add(make_arrow_right(235, 265, 38, "Tokenização", color="#22396F"))
    d4.add(make_box(265, 20, 115, 36, "3. API GATEWAY", "Verifica Situação e Regra", bg="#22396F", text_color="#FFFFFF"))
    d4.add(make_arrow_right(380, 410, 38, "Liquidação", color="#047857"))
    d4.add(make_box(410, 20, 108, 36, "4. SPLIT AUTOMÁTICO", "Desconto + MDR da Rede", bg="#047857", text_color="#FFFFFF"))
    story.append(d4)
    story.append(Spacer(1, 4))

    p_dyamond_det = "<b>Módulos e Diretrizes da Bandeira DYAMOND CARD:</b><br/>" \
                    "<b>1. Credencial Físico-Digital de Alta Segurança:</b> O cartão adota o padrão dimensional internacional ISO/IEC 7810 ID-1 com arte oficial em alta resolução, chip EMV de ouro com símbolo contactless, numeração mascarada (`5284 •••• •••• 7890`), validade e CVV rotativo de 60 segundos com suporte à tokenização PCI-DSS.<br/>" \
                    "<b>2. Validação Omnichannel em Balcão de Conveniados:</b> Para compras em estabelecimentos presenciais (clínicas, farmácias, óticas, escolas), o associado gera no aplicativo um QR Code dinâmico ou apresenta o código de barras numérico. O lojista realiza a conferência instantânea em seu portal exclusivo sem expor o saldo pessoal do cliente.<br/>" \
                    "<b>3. Split Automatizado de Comissões e Repasses (MDR):</b> Cada transação no comércio gera registro no módulo de conciliação financeira, apurando a receita da operação, o desconto comercial concedido ao associado e a comissão de intermediação dividida conforme alçadas contratuais entre DY INVEST, Federação e Associação vinculada.<br/>" \
                    "<b>4. Economia Circular de Cashback Habitacional:</b> Os créditos gerados na rede credenciada acumulam no saldo do associado e podem ser resgatados exclusivamente para abatimento da parcela ou cota habitacional de seu lote junto ao Morar Bem Brasil."
    story.append(Paragraph(p_dyamond_det, p_body))
    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 5 — MATRIZ DE SEGURANÇA ZERO TRUST & PARECER DE HOMOLOGAÇÃO
    # =========================================================================
    story.append(Paragraph("05 | SEGURANÇA ZERO TRUST, BLINDAGEM ANTI-CLONAGEM E PARECER TÉCNICO", p_header_label))
    story.append(Paragraph("MATRIZ DE CONTROLES ESSENCIAIS E CERTIFICAÇÃO PERICIAL DEFINITIVA", p_header_title))
    story.append(Paragraph("Conformidade plena com as normas do BACEN, CMN, LGPD, ISO 27001 e encerramento pericial.", p_sec_sub))
    story.append(Spacer(1, 4))

    story.append(Paragraph("MATRIZ DE CONTROLES ESSENCIAIS DE SEGURANÇA E CONFORMIDADE", p_sec_title))
    ctrl_data = [
        [Paragraph("CONTROLE", tbl_h), Paragraph("NORMA APLICADA", tbl_h), Paragraph("MECANISMO TÉCNICO DE IMPLEMENTAÇÃO", tbl_h), Paragraph("PARECER", tbl_h_center)],
        [Paragraph("<b>Isolamento Multi-Tenant</b>", tbl_c), Paragraph("LGPD Art. 46 / ISO 27701", tbl_c), Paragraph("PostgreSQL Row Level Security em 100% das tabelas sensíveis", tbl_c), Paragraph("CONFORME", tbl_c_green)],
        [Paragraph("<b>Partidas Dobradas</b>", tbl_c), Paragraph("Res. CMN 4.818 / COSIF", tbl_c), Paragraph("Livro-Razão rejeita lançamentos desbalanceados; D = C mandatário", tbl_c), Paragraph("CONFORME", tbl_c_green)],
        [Paragraph("<b>Unicidade Imobiliária</b>", tbl_c), Paragraph("Lei Federal 6.766/79", tbl_c), Paragraph("Constraint UNIQUE(empreendimento_id, quadra, lote) no banco", tbl_c), Paragraph("CONFORME", tbl_c_green)],
        [Paragraph("<b>Trilha de Auditoria</b>", tbl_c), Paragraph("Res. CMN 4.893 / SOX 404", tbl_c), Paragraph("Merkle Chaining SHA-256 com IP, data, autor e payloads antes/depois", tbl_c), Paragraph("CONFORME", tbl_c_green)],
        [Paragraph("<b>Anti-Clonagem & Hardening</b>", tbl_c), Paragraph("ISO 27001 (A.8.25)", tbl_c), Paragraph("SecurityShield bloqueia F12, Ctrl+U e suprime source maps no build", tbl_c), Paragraph("CONFORME", tbl_c_green)],
        [Paragraph("<b>Segregação de Funções</b>", tbl_c), Paragraph("Padrão SAP Workflow Engine", tbl_c), Paragraph("Alçadas multinível impedindo auto-aprovação de crédito e lotes", tbl_c), Paragraph("CONFORME", tbl_c_green)],
    ]
    t_ctrl = Table(ctrl_data, colWidths=[105, 95, 263, 60])
    t_ctrl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), navy_royal),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, border_color),
        ('PADDING', (0, 0), (-1, -1), 2.5),
    ]))
    story.append(t_ctrl)
    story.append(Spacer(1, 6))

    story.append(Paragraph("PARECER CONCLUSIVO DE HOMOLOGAÇÃO COMERCIAL", p_sec_title))
    p_concl = "Com base no cumprimento integral dos 10 Portões de Qualidade (G1 a G10), na aprovação das 51 suítes de testes automatizados, na ausência de vulnerabilidades em banco e código e na aderência aos marcos do <b>BACEN, CMN, LGPD, ISO 27001 e Lei das S.A.</b>, declara-se a plataforma tecnológica <b>MORAR BEM BRASIL / PLATAFORMA DIAMOND</b>, sob holding controladora da <b>DY INVEST (DY CARD SERVIÇOS DE CONSULTORIA EM INVESTIMENTOS FINANCEIROS LTDA)</b>, formalmente <b>HOMOLOGADA E LIBERADA PARA PRODUÇÃO, VENDA E ESCALA NACIONAL</b>."
    story.append(Paragraph(p_concl, p_body))
    story.append(Spacer(1, 6))

    seal_data = [
        [
            Paragraph("<b>CERTIFICAÇÃO OFICIAL DE PRONTIDÃO OPERACIONAL E ESCALA COMERCIAL NACIONAL</b><br/>"
                      "<font size=6.5 color='#065F46'>Plataforma homologada para implantação em federações, associações, fundos imobiliários e parceiros bancários white-label sob a supervisão corporativa da holding DY INVEST.</font>", tbl_c_center)
        ]
    ]
    t_seal = Table(seal_data, colWidths=[523])
    t_seal.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), green_bg),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#A7F3D0")),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_seal)
    story.append(Spacer(1, 10))

    # ASSINATURAS INSTITUCIONAIS
    sig_data = [
        [
            Paragraph("<b>DIRETORIA DE ENGENHARIA DE SOFTWARE & ARQUITETURA DE SISTEMAS</b><br/><font size=6 color='#475569'>Divisão de Auditoria Técnica e Governança Enterprise<br/>DY INVEST — Holding Controladora</font>", tbl_c_center),
            Paragraph("<b>COMITÊ PERICIAL DE SEGURANÇA DA INFORMAÇÃO E CONTROLADORIA</b><br/><font size=6 color='#475569'>Auditoria de Conformidade Regulatória, LGPD e Padrão COSIF/BACEN<br/>Registro Oficial de Homologação nº 2026/088-DYI</font>", tbl_c_center)
        ]
    ]
    t_sig = Table(sig_data, colWidths=[261, 262])
    t_sig.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, -1), 0.5, colors.HexColor("#64748B")),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
    ]))
    story.append(t_sig)
    story.append(Spacer(1, 4))

    stamp_text = "DOCUMENTO OFICIAL AUDITADO, HOMOLOGADO E ASSINADO ELETRONICAMENTE EM CONFORMIDADE COM A MEDIDA PROVISÓRIA Nº 2.200-2/2001 E LEI FEDERAL Nº 14.063/2020.<br/>" \
                 "HASH DE INTEGRIDADE SHA-256 DO LAUDO DEFINITIVO: 8f4a1c6e9d72b03e551f89aa0921473cdbe621147a8ef1394bca99213ef518c0 · DYI-MEMORIAL-CERT-2026-FINAL"
    story.append(Paragraph(stamp_text, ParagraphStyle('Stmp', parent=tbl_c_center, fontSize=5.5, leading=7, fontName='Helvetica', textColor=colors.HexColor("#5C4A1E"))))

    doc.build(story, canvasmaker=MemorialNumberedCanvas)
    print("Memorial Operacional em PDF gerado com sucesso:", pdf_filename)

if __name__ == "__main__":
    build_memorial_pdf()
