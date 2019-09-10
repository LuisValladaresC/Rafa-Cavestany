/* ------------------------------------------------------------ */
/* DEFINE LA SECCION QUE MOSTRARA EL INDEX CUANDO CAMBIA LA URL */
/* ------------------------------------------------------------ */

const $main_sections = Array.from(document.getElementsByClassName('main_section'));
const $menu_options = Array.from(document.getElementsByClassName('menu__link'));

window.addEventListener('popstate', load_section);

function load_section() {
    let centinela = false;

    $main_sections.map(($section, index) => {
        $section.classList.remove('active');
        $menu_options[index].classList.remove('active')

        if (document.location.href.includes($section.id)) {
            if (!centinela) {
                $section.classList.add('active');
                $menu_options[index].classList.add('active')
            }
            centinela = true;
        }
    })

    if (!centinela) {
        $main_sections[0].classList.add('active');
        $menu_options[0].classList.add('active')
    }
}

load_section();

/* -------------------------------------------------------- */
/* TRABAJAMOS CON EL MENU DESPLEGABLE EN VERSION RESPONSIVE */
/* -------------------------------------------------------- */

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
