function formatNumber(num) {
    const number = parseInt(num);
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}


module.exports = formatNumber;
