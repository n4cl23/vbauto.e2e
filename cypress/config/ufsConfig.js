const UFS = {
    AC: {
        estado: 'Acre',
        cidade: 'Rio Branco',
        cep: '69900078',
        logradouro: 'Avenida Brasil',
        bairro: 'Centro'
    },
    AL: {
        estado: 'Alagoas',
        cidade: 'Maceió',
        cep: '57020000',
        logradouro: 'Rua do Comercio',
        bairro: 'Centro'
    },
    AM: {
        estado: 'Amazonas',
        cidade: 'Manaus',
        cep: '69005040',
        logradouro: 'Avenida Eduardo Ribeiro',
        bairro: 'Centro'
    },
    AP: {
        estado: 'Amapá',
        cidade: 'Macapá',
        cep: '68900073',
        logradouro: 'Avenida FAB',
        bairro: 'Central'
    },
    BA: {
        estado: 'Bahia',
        cidade: 'Salvador',
        cep: '40020000',
        logradouro: 'Avenida Sete de Setembro',
        bairro: 'Centro'
    },
    CE: {
        estado: 'Ceará',
        cidade: 'Fortaleza',
        cep: '60025060',
        logradouro: 'Rua Senador Pompeu',
        bairro: 'Centro'
    },
    DF: {
        estado: 'Distrito Federal',
        cidade: 'Brasília',
        cep: '70040900',
        logradouro: 'Setor Bancário Sul Quadra 1',
        bairro: 'Asa Sul'
    },
    ES: {
        estado: 'Espírito Santo',
        cidade: 'Vitória',
        cep: '29010001',
        logradouro: 'Avenida Jerônimo Monteiro',
        bairro: 'Centro'
    },
    GO: {
        estado: 'Goiás',
        cidade: 'Goiânia',
        cep: '74003010',
        logradouro: 'Avenida Goiás',
        bairro: 'Setor Central'
    },
    MA: {
        estado: 'Maranhão',
        cidade: 'São Luís',
        cep: '65010000',
        logradouro: 'Rua Grande',
        bairro: 'Centro'
    },
    MG: {
        estado: 'Minas Gerais',
        cidade: 'Belo Horizonte',
        cep: '30140071',
        logradouro: 'Avenida Afonso Pena',
        bairro: 'Centro'
    },
    MS: {
        estado: 'Mato Grosso do Sul',
        cidade: 'Campo Grande',
        cep: '79002071',
        logradouro: 'Avenida Afonso Pena',
        bairro: 'Centro'
    },
    MT: {
        estado: 'Mato Grosso',
        cidade: 'Cuiabá',
        cep: '78005000',
        logradouro: 'Avenida Getúlio Vargas',
        bairro: 'Centro'
    },
    PA: {
        estado: 'Pará',
        cidade: 'Belém',
        cep: '66010000',
        logradouro: 'Avenida Presidente Vargas',
        bairro: 'Campina'
    },
    PB: {
        estado: 'Paraíba',
        cidade: 'João Pessoa',
        cep: '58010000',
        logradouro: 'Avenida General Osório',
        bairro: 'Centro'
    },
    PE: {
        estado: 'Pernambuco',
        cidade: 'Recife',
        cep: '50030000',
        logradouro: 'Avenida Dantas Barreto',
        bairro: 'Santo Antônio'
    },
    PI: {
        estado: 'Piauí',
        cidade: 'Teresina',
        cep: '64000040',
        logradouro: 'Rua Coelho Rodrigues',
        bairro: 'Centro'
    },
    PR: {
        estado: 'Paraná',
        cidade: 'Curitiba',
        cep: '80010000',
        logradouro: 'Rua XV de Novembro',
        bairro: 'Centro'
    },
    RJ: {
        estado: 'Rio de Janeiro',
        cidade: 'Rio de Janeiro',
        cep: '20040002',
        logradouro: 'Avenida Rio Branco',
        bairro: 'Centro'
    },
    RN: {
        estado: 'Rio Grande do Norte',
        cidade: 'Natal',
        cep: '59020000',
        logradouro: 'Avenida Rio Branco',
        bairro: 'Cidade Alta'
    },
    RO: {
        estado: 'Rondônia',
        cidade: 'Porto Velho',
        cep: '76801020',
        logradouro: 'Avenida Sete de Setembro',
        bairro: 'Centro'
    },
    RR: {
        estado: 'Roraima',
        cidade: 'Boa Vista',
        cep: '69301000',
        logradouro: 'Avenida Capitão Ene Garcez',
        bairro: 'Centro'
    },
    RS: {
        estado: 'Rio Grande do Sul',
        cidade: 'Porto Alegre',
        cep: '90010000',
        logradouro: 'Rua dos Andradas',
        bairro: 'Centro Histórico'
    },
    SC: {
        estado: 'Santa Catarina',
        cidade: 'Florianópolis',
        cep: '88010000',
        logradouro: 'Rua Felipe Schmidt',
        bairro: 'Centro'
    },
    SE: {
        estado: 'Sergipe',
        cidade: 'Aracaju',
        cep: '49010000',
        logradouro: 'Rua João Pessoa',
        bairro: 'Centro'
    },
    SP: {
        estado: 'São Paulo',
        cidade: 'São Paulo',
        cep: '01001000',
        logradouro: 'Praça da Sé',
        bairro: 'Sé'
    },
    TO: {
        estado: 'Tocantins',
        cidade: 'Palmas',
        cep: '77001002',
        logradouro: 'Avenida Juscelino Kubitschek',
        bairro: 'Plano Diretor Sul'
    }
}

const CEP_PREFIXOS_POR_UF = {
    AC: ['699'],
    AL: ['570', '571', '572', '573', '574', '575', '576', '577', '578', '579'],
    AM: ['690', '691', '692', '693', '694', '695', '696', '697', '698'],
    AP: ['689'],
    BA: ['400', '401', '402', '403', '404', '405', '406', '407', '408', '409', '41', '42', '43', '44', '45', '46', '47', '48'],
    CE: ['600', '601', '602', '603', '604', '605', '606', '607', '608', '609', '61', '62', '63'],
    DF: ['700', '701', '702', '703', '704', '705', '706', '707', '708', '709', '71', '72', '73'],
    ES: ['290', '291', '292', '293', '294', '295', '296', '297', '298', '299'],
    GO: ['728', '729', '737', '738', '739', '74', '75', '76'],
    MA: ['650', '651', '652', '653', '654', '655', '656', '657', '658', '659'],
    MG: ['300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '31', '32', '33', '34', '35', '36', '37', '38', '39'],
    MS: ['790', '791', '792', '793', '794', '795', '796', '797', '798', '799'],
    MT: ['780', '781', '782', '783', '784', '785', '786', '787', '788'],
    PA: ['660', '661', '662', '663', '664', '665', '666', '667', '668', '669', '67', '68'],
    PB: ['580', '581', '582', '583', '584', '585', '586', '587', '588', '589'],
    PE: ['500', '501', '502', '503', '504', '505', '506', '507', '508', '509', '51', '52', '53', '54', '55', '56'],
    PI: ['640', '641', '642', '643', '644', '645', '646', '647', '648', '649'],
    PR: ['800', '801', '802', '803', '804', '805', '806', '807', '808', '809', '81', '82', '83', '84', '85', '86', '87'],
    RJ: ['200', '201', '202', '203', '204', '205', '206', '207', '208', '209', '21', '22', '23', '24', '25', '26', '27', '28'],
    RN: ['590', '591', '592', '593', '594', '595', '596', '597', '598', '599'],
    RO: ['768', '769'],
    RR: ['693'],
    RS: ['900', '901', '902', '903', '904', '905', '906', '907', '908', '909', '91', '92', '93', '94', '95', '96', '97', '98', '99'],
    SC: ['880', '881', '882', '883', '884', '885', '886', '887', '888', '889', '89'],
    SE: ['490', '491', '492', '493', '494', '495', '496', '497', '498', '499'],
    SP: ['010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '02', '03', '04', '05', '06', '07', '08', '09', '1'],
    TO: ['770', '771', '772', '773', '774', '775', '776', '777', '778', '779']
}


const DDD_POR_UF = {
    AC: '68', AL: '82', AM: '92', AP: '96', BA: '71', CE: '85', DF: '61', ES: '27',
    GO: '62', MA: '98', MG: '31', MS: '67', MT: '65', PA: '91', PB: '83', PE: '81',
    PI: '86', PR: '41', RJ: '21', RN: '84', RO: '69', RR: '95', RS: '51', SC: '48',
    SE: '79', SP: '11', TO: '63'
}

export {
    CEP_PREFIXOS_POR_UF,
    DDD_POR_UF,
    UFS
}
