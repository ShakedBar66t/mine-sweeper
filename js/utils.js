function getRandomColor() {
    const letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function toggleModal(shouldOpen, message = '') {
    const elModal = document.querySelector('.modal')
    elModal.style.display = shouldOpen ? 'block' : 'none'
    const elMessage = elModal.querySelector('.modal-message')
    elMessage.innerText = message
    
}


    function getRandomInt(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min) + min)
    }








