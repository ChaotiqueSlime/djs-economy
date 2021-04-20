function formatNumber(num) {
    const number = parseInt(num);
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function randomNumber() {
    const number = Math.floor(Math.random() * 36)
    return number;
}


module.exports = formatNumber, randomNumber;
