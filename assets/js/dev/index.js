/* -------------------------------------------------------------------------------------------------------------------- */
/* CREA Y AÑADE LOS ELEMENTOS DE LA SECCION BOOKS, MUSIC Y ABOUT_ME CON LA INFO DEL SCRIPT DATA.JS IMPORTADO EN EL HTML */
/* -------------------------------------------------------------------------------------------------------------------- */

(function add_data_to_HTML() {
    let books = DATA.books || "";
    let books_template = "";
    
    let music = DATA.music || "";
    let music_template = "";
    
    let about_me = DATA.about_me || "";
    let about_me_template = "";

    if (books) books.map((element) => books_template += create_HTML_template("books", element))
    if (music) music.map((element) => music_template += create_HTML_template("music", element))
    if (about_me) about_me.map((element) => about_me_template += create_HTML_template("about_me", element))

    if (books_template) {
        let $books_galery = document.getElementById("books_galery");
        $books_galery.innerHTML = books_template;
    } else {
        document.getElementById("books").style.display = "none";
    }

    if (music_template) {
        let $music_galery = document.getElementById("music_galery");
        $music_galery.innerHTML = music_template;
    } else {
        document.getElementById("music").style.display = "none";
    }

    if (about_me_template) {
        let $about_content = document.getElementById("about_content");
        $about_content.innerHTML = about_me_template;
    } else {
        let $nav_link_about = document.querySelector(".navbar__link--about")
        let $menu_link_about = document.querySelector(".menu__link--about")
        $nav_link_about.style.display = "none";
        $menu_link_about.style.display = "none";
    }

    /* ---------------------------------------------------------------------------------------------- */
    /* CREA UN STRING CON ESTRUCTURA HTML, EL CUAL SERA DIFERENTE SEGUN EL CONTENEDOR QUE LO SOLICITE */
    /* ---------------------------------------------------------------------------------------------- */

    function create_HTML_template(container, data) {
        var template = "";
    
        switch (container) {
            case "books":
            case "music":
                if (data.image) {
                    template = `
                    <a class="section__link" ${data.link ? `href="${data.link}"` : ''} target="_blank">
                        <img class="section__image" src="${data.image}" alt="${data.title || ''}" 
                        ${data.image2x || data.image3x ? `srcset="${data.image3x ? data.image3x + ' 3x,' : ''}
                            ${data.image2x ? data.image2x + ' 2x,' : ''} 
                            ${data.image + ' 1x'}">`
                        : '>'}
                    </a>`
                }
                break;
            case "about_me":
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
})()

/* -------------------------------------------------------------------- */
/* ESTABLECE LA FUNCIONALIDAD Y ANIMACION DE LOADING PARA LA PAGINA WEB */
/* -------------------------------------------------------------------- */


const $main = document.querySelector('main')
window.addEventListener("load", show_loaded_HTML);

function show_loaded_HTML() {
    document.getElementById('loader').classList.add('hidden');

    // Temporizador de 1000ms. Tiempo que dura la animacion del selector .loader.hidden
    setTimeout(() => {
        $main.style.visibility = 'visible';
        document.getElementById('header').classList.add('active');

        // Temporizador de 250ms. Tiempo que dura la animacion del selector header.active */
        setTimeout(() => {
            load_section();
            document.getElementById('footer').classList.add('active');

            window.removeEventListener("load", show_loaded_HTML);
        }, 250);
    }, 1000)
}

/* --------------------------------------------------------------------------------------------------- */
/* MUESTRA LA SECCION SEGUN EL ID DEFINIDO EN LA URL LO QUE PERMITE NAVEGAR SIN RECARGAR LA PAGINA WEB */
/* --------------------------------------------------------------------------------------------------- */

const $main_sections = Array.from(document.getElementsByClassName('main__section'));

const $home_elements = Array.from(document.querySelectorAll('.main__title--home, .section__header, .section__link'));
const $about_elements = Array.from(document.querySelectorAll('.main__title--about, .about__content'));
const $social_elements = Array.from(document.querySelectorAll('.main__title--social, .social__link'));
const $contact_elements = Array.from(document.querySelectorAll('.main__title--contact, .contact__link'));

var $current_section;
var $current_section_elements;
var number_of_active_animations = 0;

window.addEventListener('popstate', load_section);

function load_section() {
    if ($current_section) {
        $main.classList.remove($current_section.id)
        
        $current_section_elements.map($element => {
            $element.classList.remove('animation');
        })
        number_of_active_animations = 0;
    }

    $current_section = $main_sections.find(($section) => {
        return document.location.href.includes('#'+$section.id);
    }) || $main_sections[0];

    $main.classList.add($current_section.id);

    if ($current_section.id == 'home') $current_section_elements = $home_elements;
    else if ($current_section.id == 'about_me') $current_section_elements = $about_elements;
    else if ($current_section.id == 'social') $current_section_elements = $social_elements;
    else if ($current_section.id == 'contact') $current_section_elements = $contact_elements;

    window.scrollTo(0, 0);

    /* ------------------------------------------------------------------------------------------------ */
    /* AÑADE UNA ANIMACION DE ENTRADA A CADA ELEMENTO HMTL DE LA SECCION ACTUAL AL APARECER EN PANTALLA */
    /* ------------------------------------------------------------------------------------------------ */

    document.addEventListener('scroll', add_animations);
    window.addEventListener('onorientationchange', add_animations);
    window.addEventListener('resize', add_animations);

    setTimeout(add_animations, 1);

    function add_animations() {
        let scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    
        $current_section_elements.map($element => {
            if ($element.offsetTop - window.innerHeight + 50 <= scrollPosition) {
                if (!$element.classList.contains('animation')) {
                    $element.classList.add('animation')
                    number_of_active_animations++;
                }
            }
        })
    
        if (number_of_active_animations >= $current_section_elements.length) {
            document.removeEventListener('scroll', add_animations)
            window.removeEventListener('onorientationchange', add_animations);
            window.removeEventListener('resize', add_animations);
        };
    }
}

/* ------------------------------------------------------------------------------------------- */
/* MUESTRA O ESCONDE A SOLICITUD EL MENU DESPLEGABLE VISIBLE EN UN ANCHO MENOR O IGUAL A 475PX */
/* ------------------------------------------------------------------------------------------- */

const $menu_button = document.getElementById('menu_button');
const $menu_button_lines = Array.from(document.getElementsByClassName('menu__line'));

const $menu = document.getElementById('menu');
const $menu_options = Array.from(document.getElementsByClassName('menu__link'));
const $logo = document.querySelector('.navbar__link--logo');

$menu_button.addEventListener('click', toggle_menu);
$menu_options.map($element => $element.addEventListener('click', toggle_menu));

function toggle_menu() {
    $menu_button_lines.map($element => $element.classList.toggle('active'));
    $menu.classList.toggle('active');

    if ($menu.classList.contains('active')) {
        document.body.classList.add('overflow__hidden');
        $logo.addEventListener('click', toggle_menu);
    } else {
        document.body.classList.remove('overflow__hidden');
        $logo.removeEventListener('click', toggle_menu)
    }
}