function logoAnimate() {
    var logo = document.querySelector('[data-js="logo"]');
    console.log(logo);
    logo.addEventListener('mouseenter', function (e) {
        e.target.classList.add('animate');
    });
}

window.onload = function () {
    logoAnimate();
};

$('.message a').click(function () {
    $('form').animate({height: 'toggle', opacity: 'toggle'}, 'slow');
});