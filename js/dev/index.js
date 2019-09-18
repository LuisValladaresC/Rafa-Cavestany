/* --------------------------------------------------------------------------------------------------------------- */
/* CON EL OBJETO JSON OBTENIDO DE OTRO SCRIPT EN EL HTML SE CREAN LOS ELEMENTOS DE LA SECCION BOOKS, MUSIC Y ABOUT */
/* --------------------------------------------------------------------------------------------------------------- */

const $books_galery = document.getElementById("books_galery");
const $music_galery = document.getElementById("music_galery");
const $about_content = document.getElementById("about_content");

add_data();

function add_data() {
    let books = DATA.books || null;
    let books_template = "";
    
    let music = DATA.music || null;
    let music_template = "";
    
    let about_me = DATA.about_me || null;
    let about_me_template = "";

    if (books) books.map((element) => books_template += create_template($books_galery, element))
    if (music) music.map((element) => music_template += create_template($music_galery, element))
    if (about_me) about_me.map((element) => about_me_template += create_template($about_content, element))

    if (books_template) $books_galery.innerHTML = books_template;
    else document.getElementById("books").style.display = "none";

    if (music_template) $music_galery.innerHTML = music_template;
    else document.getElementById("music").style.display = "none";
    
    if (about_me_template) $about_content.innerHTML = about_me_template;
    else {
        document.querySelector(".navbar__link--about").style.display = "none";
        document.querySelector(".menu__link--about").style.display = "none";
    }
}

function create_template($container, data) {
    var template = "";

    switch ($container) {
        case $books_galery:
        case $music_galery:
            if (data.image) {
                template = `
                <a class="section__link" ${data.link ? `href="${data.link}"` : ''} target="_blank">
                    <img class="section__image" src="${data.image}" alt="${data.title || ''}" 
                    ${data.image2x || data.image3x ? `srcset="${data.image + ' 1x'}
                        ${data.image2x ? ',' + data.image2x + ' 2x' : ''} 
                        ${data.image3x ? ',' + data.image3x + ' 3x' : ''}">`
                    : '>'}
                </a>`
            }
        break;
            
        case about_content:
            if (data.startsWith("###")) {
                data = data.replace("###", "");
                template = `<h3 class="about__title">${data}</h3>`;
            } else {
                template = `<p class="about__text">${data}</p>`;
            }
        break;
    }

    return template;
}

/* -------------------------------------------------------------------- */
/* ESTABLECE LA FUNCIONALIDAD Y ANIMACION DE LOADING PARA LA PAGINA WEB */
/* -------------------------------------------------------------------- */

const $loader = document.getElementById('loader');
const $header = document.getElementById('header');
const $footer = document.getElementById('footer');
const $main = document.querySelector('main');

window.addEventListener("load", () => {
    $loader.classList.add('hidden');
    setTimeout(() => {
        $header.classList.add('active');
        $main.style.visibility = 'visible';

        setTimeout(() => {
            load_section();
            $footer.classList.add('active');
        }, 250);
        /* 250ms es el tiempo que dura la animacion de fade-in en los elementos del header */
    }, 1000)
    /* 1000ms es el tiempo que dura la animacion de la clase .loader.hidden */
})

/* --------------------------------------------------------------------------------------------------- */
/* MUESTRA LA SECCION SEGUN EL ID DEFINIDO EN LA URL LO QUE PERMITE NAVEGAR SIN RECARGAR LA PAGINA WEB */
/* --------------------------------------------------------------------------------------------------- */

const $main_sections = Array.from(document.getElementsByClassName('main__section'));
const $navbar_options = Array.from(document.getElementsByClassName('navbar__link'));
const $menu_options = Array.from(document.getElementsByClassName('menu__link'));

const $home_elements = Array.from(document.querySelectorAll('.main__title--home, .section__header, .section__link'));
const $about_elements = Array.from(document.querySelectorAll('.main__title--about, .about__text, .about__title'));
const $social_elements = Array.from(document.querySelectorAll('.main__title--social, .social__link'));
const $contact_elements = Array.from(document.querySelectorAll('.main__title--contact, .contact__link'));

var $current_section = $main_sections[0];
var $current_section_elements = $home_elements;

var number_of_active_animations;

window.addEventListener('popstate', load_section);

function load_section() {
    remove_animations()
    number_of_active_animations = 0;

    let loaded_section = false;
    $main_sections.map(($section, index) => {
        $section.classList.remove('active');
        $navbar_options[index].classList.remove('active');
        $menu_options[index].classList.remove('active')
        
        if (document.location.href.includes('#'+$section.id) && loaded_section == false) {
            $section.classList.add('active');
            $navbar_options[index].classList.add('active');
            $menu_options[index].classList.add('active');
            
            $current_section = $section;
            if ($current_section.id == 'home') $current_section_elements = $home_elements;
            else if ($current_section.id == 'about_me') $current_section_elements = $about_elements;
            else if ($current_section.id == 'social') $current_section_elements = $social_elements;
            else if ($current_section.id == 'contact') $current_section_elements = $contact_elements;

            loaded_section = true;
        }
    })

    if (loaded_section == false) {
        $main_sections[0].classList.add('active');
        $navbar_options[0].classList.add('active');
        $menu_options[0].classList.add('active');
    }

    document.addEventListener('scroll', add_animations);
    window.addEventListener('onorientationchange', add_animations);
    window.addEventListener('resize', add_animations);

    setTimeout(add_animations, 1);
}

/* --------------------------------------------------------------------------------------------------------- */
/* AÑADE UNA ANIMACION DE ENTRADA A CADA ELEMENTO MEDIANTE EL SCROLL SPY Y LAS REMUEVE AL CAMBIAR DE SECCION */
/* --------------------------------------------------------------------------------------------------------- */

var x = [];
var timer = 0;

function add_animations() {
    let delay_spacing = window.innerWidth * 0.15;
    if (delay_spacing > 170) delay_spacing = 170;

    let scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

    $current_section_elements.map($element => {
        if ($element.offsetTop - window.innerHeight + 50 <= scrollPosition && !$element.classList.contains('section__link') ||
            $element.offsetTop - window.innerHeight + delay_spacing <= scrollPosition && $element.classList.contains('section__link')) {
            if (!$element.classList.contains('animation')) {
                $element.classList.add('animation')
                number_of_active_animations++;
            }
        }
    })

    if (number_of_active_animations >= $current_section_elements.length) remove_events_for_animations();
}

function remove_animations() {
    $current_section_elements.map($element => {
        $element.classList.remove('fade_in');
        $element.classList.remove('animation');
        $element.classList.remove('image_animation');
    })
}

function remove_events_for_animations() {
    document.removeEventListener('scroll', add_animations)
    window.removeEventListener('onorientationchange', add_animations);
    window.removeEventListener('resize', add_animations);
}

/* ---------------------------------------------------------------------------- */
/* FUNCIONALIDAD Y ANIMACIONES DEL MENU DESPLEGABLE VISIBLE EN LA VERSION MOVIL */
/* ---------------------------------------------------------------------------- */

const $menu = document.getElementById('menu');
const $menu_button = document.getElementById('menu_button');
const $menu_button_lines = Array.from(document.getElementsByClassName('menu__line'));
const $logo = document.querySelector('.navbar__link--logo');

$menu_button.addEventListener('click', show_hide_menu);
$menu_options.map($element => $element.addEventListener('click', show_hide_menu));

function show_hide_menu() {
    $menu_button_lines.map($button_line => {
        $button_line.classList.toggle('active');
    });
    $menu.classList.toggle('active');

    if ($menu.classList.contains('active')) {
        document.body.classList.add('overflow__hidden');
        $logo.addEventListener('click', show_hide_menu);
    }
    else {
        document.body.classList.remove('overflow__hidden');
        $logo.removeEventListener('click', show_hide_menu)
    }
}