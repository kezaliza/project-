function getProductPrice(productNumber) {
    if (!Number.isInteger(productNumber) || productNumber < 1 || productNumber > 50) {
        throw new RangeError(`No category price is defined for product ${productNumber}.`);
    }

    if (productNumber <= 5 || (productNumber >= 21 && productNumber <= 25)) return "$15";
    if (productNumber <= 10) return "$20";
    if (productNumber <= 15) return "$35";
    if (productNumber <= 20) return "$25";
    if (productNumber <= 30) return "$18";
    if (productNumber <= 40) return "$12";
    if (productNumber <= 45) return "$8";
    return "$38";
}
