exports.validarCNPJ = (cnpj) => {
    const cnpjLimpo = cnpj.replace(/[^\d]/g, ''); // Remove todos os caracteres não numéricos

    if (cnpjLimpo.length !== 14) {
        return false; // O CNPJ deve ter 14 dígitos após a limpeza
    }

    if (/^(\d)\1+$/.test(cnpjLimpo)) {
        return false; // Verifica se todos os dígitos são iguais
    }

    // Calcula o primeiro dígito verificador
    let soma = 0;
    let peso = 2;
    for (let i = 11; i >= 0; i--) {
        soma += parseInt(cnpjLimpo.charAt(i)) * peso;
        peso = peso === 9 ? 2 : peso + 1;
    }
    const digitoVerificador1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    // Verifica o primeiro dígito verificador
    if (parseInt(cnpjLimpo.charAt(12)) !== digitoVerificador1) {
        return false;
    }

    // Calcula o segundo dígito verificador
    soma = 0;
    peso = 2;
    for (let i = 12; i >= 0; i--) {
        soma += parseInt(cnpjLimpo.charAt(i)) * peso;
        peso = peso === 9 ? 2 : peso + 1;
    }
    const digitoVerificador2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    // Verifica o segundo dígito verificador
    if (parseInt(cnpjLimpo.charAt(13)) !== digitoVerificador2) {
        return false;
    }

    return true; // Se todas as verificações passaram, o CNPJ é válido
}