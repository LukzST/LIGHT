
window.addEventListener("beforeunload", function () {
    document.body.classList.add("animate-out");
});


function itch() {
    window.open('https://UndPixelGames.itch.io/light/purchase?popup=1', 'Popup', 'width=500,height=400,scrollbars=no');
}
function support() {
    window.open('mailto:contatosadberry@gmail.com', 'Popup', 'width=500,height=400,scrollbars=no');
}

function soundtrack() {
    window.open('https://www.youtube.com/playlist?list=PLstaXaIuDSEidUQAif2ptoqswAv8qTJ6y', 'Popup', 'width=800,height=600,scrollbars=no');
}
function screenshot1() {
    window.open('/Public/IMG/screen1.png', 'Popup', 'width=800,height=600,scrollbars=no');
}
function screenshot2() {
    window.open('/Public/IMG/screen2.png', 'Popup', 'width=800,height=600,scrollbars=no');
}
function screenshot3() {
    window.open('/Public/IMG/screen3.png', 'Popup', 'width=800,height=600,scrollbars=no');
}
function screenshot4() {
    window.open('/Public/IMG/screen4.png', 'Popup', 'width=800,height=600,scrollbars=no');
}
function screenshot5() {
    window.open('/Public/IMG/screen6.png', 'Popup', 'width=800,height=600,scrollbars=no');
}
function screenshot6() {
    window.open('/Public/IMG/screen7.png', 'Popup', 'width=800,height=600,scrollbars=no');
}
function screenshot7() {
    window.open('/Public/IMG/screen8.png', 'Popup', 'width=800,height=600,scrollbars=no');
}
function screenshot8() {
    window.open('/Public/IMG/screen9.png', 'Popup', 'width=800,height=600,scrollbars=no');
}

const menu = document.getElementById('menuMobile');

menu.addEventListener('click', function(event) {
    this.classList.toggle('active');
});

const links = document.querySelectorAll('.text_header');

links.forEach(link => {
    link.addEventListener('click', (event) => {
        event.stopPropagation(); 
        
        menu.classList.remove('active');
        
    });
});


