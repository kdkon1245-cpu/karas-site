/*
  КОНТЕНТ САЙТА KARAS
  -------------------
  Все тексты и списки сайта. Чтобы что-то поменять, правь только этот файл —
  вёрстку трогать не нужно.

  Картинки: поле cover / image = путь к файлу, например "content/posters/smotri.webp".
  Если поле пустое (null) — сайт рисует фирменную заглушку по seed.
*/
window.KARAS_DATA = {
  site: {
    name: "Ivan Karas",
    brand: "KARAS",
    role: "Бренд-дизайнер",
    city: "Москва",
    status: "Открыт к проектам",
    intro: "Делаю айдентику, плакаты и мерч, которые смотрят на тебя в ответ.",
    about: [
      "Бренд-дизайнер из Москвы. Собираю визуальные системы для брендов, музыкантов и событий: от знака до плаката и футболки.",
      "Люблю шумную типографику, коллаж и кислотный цвет, но в каждом проекте начинаю с идеи, а не с эффекта. Пишу про процесс в статьях.",
    ],
    contacts: [
      { label: "Telegram", value: "@karas_dsgn", href: "https://t.me/karas_dsgn" },
      { label: "Канал", value: "Karas Studio", href: "https://t.me/karas_studio" },
      { label: "Dprofile", value: "dprofile.ru/karaspng", href: "https://dprofile.ru/karaspng" },
      { label: "Pinterest", value: "pinterest.com/karas_png", href: "https://ru.pinterest.com/karas_png/" },
    ],
    services: ["Айдентика", "Плакаты", "Мерч", "Типографика", "Арт-дирекшн"],
  },

  /* Проекты — перенесены с Dprofile (dprofile.ru/karaspng).
     blocks — содержимое кейса по порядку: картинки (img) и видео (video).
     cover — превью для карточки, image — большая обложка. */
  projects: [
    {
      "id": "zaichik",
      "bg": { "a": "#cc6821", "b": "#9fc21d", "base": "#120c08" },
      "title": "Зайчик, не беги",
      "subtitle": "Stop-motion анимация и серия плакатов",
      "year": 2026,
      "client": "Некоммерческий проект",
      "role": "Графика, Анимация",
      "tags": [
        "Анимация",
        "Плакаты",
        "Графика"
      ],
      "featured": true,
      "cover": "content/projects/zaichik/cover-s.webp",
      "image": "content/projects/zaichik/cover.webp",
      "lead": "Стоп - моушен проект про зайца, который сквозь время и пространство преодолевает свой путь",
      "body": [
        "Некоммерческий проект"
      ],
      "blocks": [
        {
          "video": "https://kinescope.io/embed/0TLJV9S1x8r3Cx9EqRQn94",
          "w": 2032,
          "h": 1440
        },
        {
          "img": "content/projects/zaichik/01.webp",
          "w": 1600,
          "h": 1333
        },
        {
          "img": "content/projects/zaichik/02.webp",
          "w": 1600,
          "h": 1333
        },
        {
          "video": "https://kinescope.io/embed/2h5o47acaL7R7mQXehGBJu",
          "w": 1524,
          "h": 1080
        },
        {
          "img": "content/projects/zaichik/03.webp",
          "w": 1600,
          "h": 1333
        },
        {
          "img": "content/projects/zaichik/04.webp",
          "w": 1600,
          "h": 1333
        },
        {
          "video": "https://kinescope.io/embed/8QEDqXUzHQYub48kx1o3H5",
          "w": 1296,
          "h": 1080
        },
        {
          "img": "content/projects/zaichik/05.webp",
          "w": 1600,
          "h": 1333
        },
        {
          "video": "https://kinescope.io/embed/0e4eiUnSwex9VtybMMrafd",
          "w": 1296,
          "h": 1080
        },
        {
          "img": "content/projects/zaichik/06.webp",
          "w": 1600,
          "h": 1333
        },
        {
          "video": "https://kinescope.io/embed/f3Jrf9MNgungH3C1FHvNvL",
          "w": 1296,
          "h": 1080
        },
        {
          "img": "content/projects/zaichik/07.webp",
          "w": 1600,
          "h": 1333
        },
        {
          "img": "content/projects/zaichik/08.webp",
          "w": 1600,
          "h": 1333
        }
      ],
      "source": "https://dprofile.ru/case/171716/zaicik-ne-begi-stop-motion-animaciia-seriia-plakatov"
    },
    {
      "id": "aki",
      "bg": { "a": "#d9a10c", "b": "#6b5236", "base": "#15110a" },
      "title": "АКИ Хабаровского края",
      "subtitle": "Корпоративный мерч",
      "year": 2025,
      "client": "Агентство креативных индустрий Хабаровского края",
      "role": "Брендинг, Графика",
      "tags": [
        "Брендинг",
        "Мерч",
        "Графика"
      ],
      "featured": true,
      "cover": "content/projects/aki/cover-s.webp",
      "image": "content/projects/aki/cover.webp",
      "lead": "Проект для Агентства креативных индустрий Хабаровского края — айдентика коллекции корпоративного мерча.",
      "body": [
        "Мы создали новую визуальную систему в HR-направлении бренда, которая простым языком, через графику и носители, показывает, чем занимаются сотрудники АКИ.",
        "Коллекция состоит из базовой и расширенной линеек, охватывает разный уровень и профиль выездных мероприятий, обеспечивая удобный подбор узнаваемого образа."
      ],
      "blocks": [
        {
          "video": "https://kinescope.io/embed/sD9e2XsbrV2afViKxB2mbL",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/01.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/02.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "video": "https://kinescope.io/embed/qTNnkefrJGZuvTmb4wqstf",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/03.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "video": "https://kinescope.io/embed/6tizSVotfKq2dhh3MpkU8g",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/04.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/05.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "video": "https://kinescope.io/embed/cEiqcz9zVRSVEwmAo4EM5o",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/06.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/07.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/08.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "video": "https://kinescope.io/embed/oaDPYHXDmdkXJVPkh4ysL2",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/09.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/10.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/11.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/12.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/13.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/14.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "video": "https://kinescope.io/embed/0UtTubLRrzpKZ9i2GKWrjX",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/15.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/16.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/17.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/18.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/19.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/aki/20.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "video": "https://kinescope.io/embed/hNd2tHM6cQaWFhUYqS8cfL",
          "w": 1600,
          "h": 1080
        }
      ],
      "source": "https://dprofile.ru/case/160638/aki-xabarovskogo-kraia-korporativnyi-merc"
    },
    {
      "id": "monolit",
      "bg": { "a": "#e51625", "b": "#5a1418", "base": "#170708" },
      "title": "Монолит",
      "subtitle": "Акцидентный шрифт с характером",
      "year": 2024,
      "client": "Собственный проект",
      "role": "Брендинг, Графика",
      "tags": [
        "Шрифт",
        "Типографика"
      ],
      "featured": true,
      "cover": "content/projects/monolit/cover-s.webp",
      "image": "content/projects/monolit/cover.webp",
      "lead": "Монолит — акцидентный гротеск с характером, сочетающий архитектурную строгость форм и глубокую культурную отсылку. Основой дизайна стали графемы, вдохновленные уставным письмом русского языка, что придает шрифту монументальность и устойчивость. Геометрическая четкость букв гармонично соседствует с элементами, отсылающими к типографским традициям Советского Союза",
      "body": [],
      "blocks": [
        {
          "img": "content/projects/monolit/01.webp",
          "w": 1600,
          "h": 3300
        },
        {
          "img": "content/projects/monolit/02.webp",
          "w": 1600,
          "h": 3300
        },
        {
          "img": "content/projects/monolit/03.webp",
          "w": 1600,
          "h": 3300
        },
        {
          "img": "content/projects/monolit/04.webp",
          "w": 1600,
          "h": 3301
        },
        {
          "img": "content/projects/monolit/05.webp",
          "w": 1600,
          "h": 3301
        },
        {
          "img": "content/projects/monolit/06.webp",
          "w": 1600,
          "h": 4366
        }
      ],
      "source": "https://dprofile.ru/case/98550/srift-s-xarakterom-monolit",
      "links": [
        {
          "label": "Скачать шрифт",
          "href": "https://t.me/karas_studio/100"
        }
      ]
    },
    {
      "id": "my-to-chto-my-edim",
      "bg": { "a": "#5f8a22", "b": "#c0574e", "base": "#0d1308" },
      "title": "Мы — то, что мы едим",
      "subtitle": "Серия плакатов",
      "year": 2025,
      "client": "Собственный проект",
      "role": "Брендинг, Графика",
      "tags": [
        "Плакаты",
        "Графика"
      ],
      "featured": true,
      "cover": "content/projects/my-to-chto-my-edim/cover-s.webp",
      "image": "content/projects/my-to-chto-my-edim/cover.webp",
      "lead": "Цифровизация: новая базовая потребность.",
      "body": [
        "На плакатах изображена еда как основа пирамиды Маслоу — то, без чего не может жить человек. Но современный человек не может жить и без интернета, игр и других современных технологий. Можно ли это считать новой базовой потребностью?"
      ],
      "blocks": [
        {
          "img": "content/projects/my-to-chto-my-edim/01.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/my-to-chto-my-edim/02.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/my-to-chto-my-edim/03.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/my-to-chto-my-edim/04.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/my-to-chto-my-edim/05.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/my-to-chto-my-edim/06.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/my-to-chto-my-edim/07.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/my-to-chto-my-edim/08.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/my-to-chto-my-edim/09.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/my-to-chto-my-edim/10.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/my-to-chto-my-edim/11.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/my-to-chto-my-edim/12.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/my-to-chto-my-edim/13.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/my-to-chto-my-edim/14.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/my-to-chto-my-edim/15.webp",
          "w": 1600,
          "h": 1080
        }
      ],
      "source": "https://dprofile.ru/case/145734/seriia-plakatov-my-to-cto-my-edim"
    },
    {
      "id": "rezonans",
      "bg": { "a": "#9aa0aa", "b": "#3a3d44", "base": "#121315" },
      "title": "Резонанс",
      "subtitle": "Айдентика лаборатории рекламы",
      "year": 2025,
      "client": "Учебный проект, РГУ им. А.Н. Косыгина",
      "role": "Брендинг, Графика",
      "tags": [
        "Брендинг",
        "Айдентика"
      ],
      "featured": false,
      "cover": "content/projects/rezonans/cover-s.webp",
      "image": "content/projects/rezonans/cover.webp",
      "lead": "\"Резонанс\" — это лаборатория рекламы, где идеи и технологии находят свою оптимальную частоту, оставляя отклик у аудитории. Название отражает слоган компании: усиливать голос брендов, делая их сообщения эффективными. Это символ динамики, точности и гармоничного сочетания науки и практики.",
      "body": [
        "Данный проект был создан в рамках магистерской учебной программы \"Брендинг и дизайн-мышление\" в РГУ им. А.Н. Косыгина с преподователями Л.К. Козырева и Е.А.Оснач"
      ],
      "blocks": [
        {
          "img": "content/projects/rezonans/01.webp",
          "w": 1600,
          "h": 3533
        },
        {
          "img": "content/projects/rezonans/02.webp",
          "w": 1600,
          "h": 3244
        },
        {
          "img": "content/projects/rezonans/03.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/rezonans/04.webp",
          "w": 1600,
          "h": 4814
        },
        {
          "img": "content/projects/rezonans/05.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/rezonans/06.webp",
          "w": 1600,
          "h": 4330
        },
        {
          "img": "content/projects/rezonans/07.webp",
          "w": 1600,
          "h": 4335
        }
      ],
      "source": "https://dprofile.ru/case/108843/rezonans-laboratoriia-reklamy"
    },
    {
      "id": "vertikal",
      "bg": { "a": "#b48cd8", "b": "#6aa6c9", "base": "#0f0f13" },
      "title": "Вертикаль",
      "subtitle": "Ребрендинг агентства недвижимости",
      "year": 2024,
      "client": "Конкурс «Фабрика дизайна», 2 поток 2024",
      "role": "Брендинг, 3D",
      "tags": [
        "Брендинг",
        "3D"
      ],
      "featured": false,
      "cover": "content/projects/vertikal/cover-s.webp",
      "image": "content/projects/vertikal/cover.webp",
      "lead": "Проект ребрендинга компании \"Вертикаль\" был выполнен в рамках конкурса \"Фабрика дизайна: 2 поток 2024\".",
      "body": [
        "Команда подготовила новый логотип и фирменный стиль бренда, а также спроектировала ряд продуктов: дизайн фирменных носителей(Визитка, брошюра, бейдж), главную страницу сайта, шаблон для презентаций.",
        "В проекте используются 3D-анимации для иллюстрации многофункциональности и роста логотипа."
      ],
      "blocks": [
        {
          "video": "https://kinescope.io/embed/5GwLjWAdNUTRQC7DFxYy4X",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/vertikal/01.webp",
          "w": 1600,
          "h": 3248
        },
        {
          "video": "https://kinescope.io/embed/coBxqhtMoTLALHiqJW3mTc",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/vertikal/02.webp",
          "w": 1600,
          "h": 3239
        },
        {
          "img": "content/projects/vertikal/03.webp",
          "w": 1600,
          "h": 2160
        },
        {
          "img": "content/projects/vertikal/04.webp",
          "w": 1600,
          "h": 2160
        },
        {
          "video": "https://kinescope.io/embed/6XEg2fQ4gwu8AtYDwoWoh8",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/vertikal/05.webp",
          "w": 1600,
          "h": 1080
        },
        {
          "video": "https://kinescope.io/embed/retikUtek7J3BMkBA8qtSt",
          "w": 1600,
          "h": 1080
        },
        {
          "img": "content/projects/vertikal/06.webp",
          "w": 1600,
          "h": 4315
        },
        {
          "img": "content/projects/vertikal/07.webp",
          "w": 1600,
          "h": 3268
        }
      ],
      "source": "https://dprofile.ru/case/97286/rebrending-agentstva-nedvizimosti",
      "team": "Иван Карась, Алдар Канинов",
      "links": [
        {
          "label": "Алдар Канинов в Telegram",
          "href": "https://t.me/aldari1kk"
        }
      ]
    },
    {
      "id": "logofolio-2024",
      "bg": { "a": "#2bc07f", "b": "#12685c", "base": "#071510" },
      "title": "Logofolio 2024",
      "subtitle": "Любимые концепции логотипов за год",
      "year": 2024,
      "client": "Собственный проект",
      "role": "Интерфейсы, Брендинг",
      "tags": [
        "Логотипы",
        "Брендинг"
      ],
      "featured": false,
      "cover": "content/projects/logofolio-2024/cover-s.webp",
      "image": "content/projects/logofolio-2024/cover.webp",
      "lead": "В данном проекте я собрал свои любимые концепции логотипов за последний год, многие из них можно приобрести",
      "body": [],
      "blocks": [
        {
          "img": "content/projects/logofolio-2024/01.webp",
          "w": 1600,
          "h": 5978
        },
        {
          "img": "content/projects/logofolio-2024/02.webp",
          "w": 1600,
          "h": 4899
        },
        {
          "img": "content/projects/logofolio-2024/03.webp",
          "w": 1600,
          "h": 9798
        },
        {
          "img": "content/projects/logofolio-2024/04.webp",
          "w": 1600,
          "h": 200
        },
        {
          "img": "content/projects/logofolio-2024/05.webp",
          "w": 1600,
          "h": 200
        }
      ],
      "source": "https://dprofile.ru/case/96154/logofolio-2024"
    },
    {
      "id": "bloom-art-bar",
      "bg": { "a": "#2346c8", "b": "#0b1a6a", "base": "#060a1c" },
      "title": "Bloom Art-Bar",
      "subtitle": "Брендинг арт-бара",
      "year": 2023,
      "client": "Учебный проект",
      "role": "Брендинг, Маркетинг",
      "tags": [
        "Брендинг"
      ],
      "featured": false,
      "cover": "content/projects/bloom-art-bar/cover-s.webp",
      "image": "content/projects/bloom-art-bar/cover.webp",
      "lead": "Выжимка студенческой работы по брендингу.\nBloom-это уголок красоты и сказки, где вместе мы расцветаем!",
      "body": [],
      "blocks": [
        {
          "img": "content/projects/bloom-art-bar/01.webp",
          "w": 1600,
          "h": 4962
        },
        {
          "img": "content/projects/bloom-art-bar/02.webp",
          "w": 1600,
          "h": 6286
        },
        {
          "img": "content/projects/bloom-art-bar/03.webp",
          "w": 1600,
          "h": 5525
        },
        {
          "img": "content/projects/bloom-art-bar/04.webp",
          "w": 1600,
          "h": 5723
        }
      ],
      "source": "https://dprofile.ru/case/52776/bloom-art-bar"
    },
    {
      "id": "dipins",
      "bg": { "a": "#6a3bf0", "b": "#e65e48", "base": "#120a1a" },
      "title": "Морковка Дипинс",
      "subtitle": "Стикерпак для Dprofile",
      "year": 2024,
      "client": "Конкурс Dprofile",
      "role": "Брендинг, Иллюстрация",
      "tags": [
        "Иллюстрация",
        "Стикеры"
      ],
      "featured": false,
      "cover": "content/projects/dipins/cover-s.webp",
      "image": "content/projects/dipins/cover.webp",
      "lead": "Был создан стикерпак из 10 стикеров, специально для конкурса от Dprofile. Работа выполнена в программе Procreate",
      "body": [],
      "blocks": [
        {
          "img": "content/projects/dipins/01.webp",
          "w": 1600,
          "h": 7341
        }
      ],
      "source": "https://dprofile.ru/case/51563/stikerpak-dlia-dprofile-morkovka-dipins",
      "links": [
        {
          "label": "Установить стикеры",
          "href": "https://t.me/addstickers/dipicarrot"
        }
      ]
    }
  ],

  /* Вайбы плакатов: фильтр в галерее и цвет фона под него.
     a, b — цвета свечения, base — тёмная основа фона. */
  vibes: [
    { name: "Кислота", note: "неон, коллаж, шум", a: "#d0612f", b: "#2f8f70", base: "#0b120f" },
    { name: "Красный бетон", note: "брутализм и красный", a: "#e0141f", b: "#6a191b", base: "#150607" },
    { name: "Ч/Б", note: "монохром и хром", a: "#c3c8d0", b: "#3c3c3c", base: "#101010" },
    { name: "Тёплое", note: "еда, солнце, жёлтый", a: "#d29a20", b: "#7a4426", base: "#130c06" },
    { name: "Неон", note: "свечение в темноте", a: "#2fb8e8", b: "#c0287f", base: "#06070d" },
  ],

  /* Плакаты из Figma (раздел «Плакаты»).
     cover — превью для стопки, image — большая картинка для просмотра.
     ratio — ширина / высота. year — можно дописать, когда понадобится. */
  posters: [
    /* Монолит */
    { id: "mono-bw", vibe: "Ч/Б", title: "Монолит", series: "Монолит", tags: ["Типографика", "Фото"], ratio: 0.7065, cover: "content/posters/mono-bw-s.webp", image: "content/posters/mono-bw.webp" },
    { id: "mono-1961", vibe: "Красный бетон", title: "1961", series: "Монолит", tags: ["Коллаж", "Типографика"], ratio: 0.7065, cover: "content/posters/mono-1961-s.webp", image: "content/posters/mono-1961.webp" },
    { id: "mono-zarya", vibe: "Красный бетон", title: "Заря", series: "Монолит", tags: ["Типографика", "Фото"], ratio: 0.7065, cover: "content/posters/mono-zarya-s.webp", image: "content/posters/mono-zarya.webp" },
    { id: "mono-red", vibe: "Красный бетон", title: "Монолит, красный", series: "Монолит", tags: ["Типографика", "Фото"], ratio: 0.7065, cover: "content/posters/mono-red-s.webp", image: "content/posters/mono-red.webp" },
    { id: "mono-23", vibe: "Красный бетон", title: "Фестиваль спортивного контента", series: "Монолит", year: 2025, tags: ["Типографика", "Шрифт"], ratio: 0.7065, cover: "content/posters/mono-23-s.webp", image: "content/posters/mono-23.webp" },
    { id: "mono-863", vibe: "Красный бетон", title: "863 г.", series: "Монолит", tags: ["Коллаж", "Фото"], ratio: 0.7065, cover: "content/posters/mono-863-s.webp", image: "content/posters/mono-863.webp" },
    { id: "mono-brutalism", vibe: "Красный бетон", title: "Брутализм", series: "Монолит", tags: ["Типографика", "3D"], ratio: 0.7065, cover: "content/posters/mono-brutalism-s.webp", image: "content/posters/mono-brutalism.webp" },
    /* Пять будд */
    { id: "buddha-vairochana", vibe: "Неон", title: "Вайрочана", series: "Пять будд", tags: ["3D", "Графика"], ratio: 0.7067, cover: "content/posters/buddha-vairochana-s.webp", image: "content/posters/buddha-vairochana.webp" },
    { id: "buddha-amitabha", vibe: "Неон", title: "Амитабха", series: "Пять будд", tags: ["3D", "Графика"], ratio: 0.7067, cover: "content/posters/buddha-amitabha-s.webp", image: "content/posters/buddha-amitabha.webp" },
    { id: "buddha-ratnasambhava", vibe: "Неон", title: "Ратнасабхава", series: "Пять будд", tags: ["3D", "Графика"], ratio: 0.7067, cover: "content/posters/buddha-ratnasambhava-s.webp", image: "content/posters/buddha-ratnasambhava.webp" },
    { id: "buddha-akshobhya", vibe: "Неон", title: "Акшобхья", series: "Пять будд", tags: ["3D", "Графика"], ratio: 0.7067, cover: "content/posters/buddha-akshobhya-s.webp", image: "content/posters/buddha-akshobhya.webp" },
    { id: "buddha-amoghasiddhi", vibe: "Неон", title: "Амогасиддхи", series: "Пять будд", tags: ["3D", "Графика"], ratio: 0.7067, cover: "content/posters/buddha-amoghasiddhi-s.webp", image: "content/posters/buddha-amoghasiddhi.webp" },
    /* Типографика */
    { id: "type-ya", vibe: "Кислота", title: "Я", series: "Типографика", tags: ["Типографика", "Шрифт"], ratio: 0.7065, cover: "content/posters/type-ya-s.webp", image: "content/posters/type-ya.webp" },
    { id: "type-black-color", vibe: "Тёплое", title: "Цвет чёрный цвет", series: "Типографика", tags: ["Типографика", "Шрифт"], ratio: 0.7065, cover: "content/posters/type-black-color-s.webp", image: "content/posters/type-black-color.webp" },
    { id: "type-zarya", vibe: "Неон", title: "Заря, градиент", series: "Типографика", tags: ["Типографика", "Цвет"], ratio: 0.7065, cover: "content/posters/type-zarya-s.webp", image: "content/posters/type-zarya.webp" },
    /* Мы — то, что мы едим */
    { id: "food-banana", vibe: "Тёплое", title: "Digital Banana", series: "Мы — то, что мы едим", year: 2025, tags: ["Нейросети", "Коллаж"], ratio: 0.7067, cover: "content/posters/food-banana-s.webp", image: "content/posters/food-banana.webp" },
    { id: "food-apple", vibe: "Тёплое", title: "Apple Desktop", series: "Мы — то, что мы едим", year: 2025, tags: ["Нейросети", "Коллаж"], ratio: 0.7067, cover: "content/posters/food-apple-s.webp", image: "content/posters/food-apple.webp" },
    { id: "food-pizza", vibe: "Кислота", title: "I love pizza", series: "Мы — то, что мы едим", year: 2025, tags: ["Нейросети", "Типографика"], ratio: 0.7067, cover: "content/posters/food-pizza-s.webp", image: "content/posters/food-pizza.webp" },
    { id: "food-pancakes", vibe: "Тёплое", title: "Потеря реальности", series: "Мы — то, что мы едим", year: 2025, tags: ["Нейросети", "Графика"], ratio: 0.7067, cover: "content/posters/food-pancakes-s.webp", image: "content/posters/food-pancakes.webp" },
    { id: "food-cherry", vibe: "Кислота", title: "Нейросеть. Пошлость 2025 года", series: "Мы — то, что мы едим", year: 2025, tags: ["Нейросети"], ratio: 0.7067, cover: "content/posters/food-cherry-s.webp", image: "content/posters/food-cherry.webp" },
    { id: "food-cucumber", vibe: "Кислота", title: "Мы — то, что мы едим", series: "Мы — то, что мы едим", year: 2025, tags: ["Нейросети"], ratio: 0.7067, cover: "content/posters/food-cucumber-s.webp", image: "content/posters/food-cucumber.webp" },
    /* Зайчик, не беги */
    { id: "bunny-marker", vibe: "Тёплое", title: "Маркер", series: "Зайчик, не беги", year: 2026, tags: ["Графика", "Иллюстрация"], ratio: 1.4149, cover: "content/posters/bunny-marker-s.webp", image: "content/posters/bunny-marker.webp" },
    { id: "bunny-gothic", vibe: "Ч/Б", title: "Готика", series: "Зайчик, не беги", year: 2026, tags: ["Графика", "Коллаж"], ratio: 1.4148, cover: "content/posters/bunny-gothic-s.webp", image: "content/posters/bunny-gothic.webp" },
    { id: "bunny-kolbasenko", vibe: "Кислота", title: "Данил Колбасенко", series: "Зайчик, не беги", year: 2026, tags: ["Типографика", "Коллаж"], ratio: 1.4149, cover: "content/posters/bunny-kolbasenko-s.webp", image: "content/posters/bunny-kolbasenko.webp" },
    { id: "bunny-xray", vibe: "Ч/Б", title: "Рентген", series: "Зайчик, не беги", year: 2026, tags: ["Графика"], ratio: 1.4149, cover: "content/posters/bunny-xray-s.webp", image: "content/posters/bunny-xray.webp" },
    /* Разное */
    { id: "cathedral", vibe: "Тёплое", title: "Собор", series: "Разное", tags: ["Фото", "Типографика"], ratio: 0.6773, cover: "content/posters/cathedral-s.webp", image: "content/posters/cathedral.webp" },
    { id: "cathedral-bw", vibe: "Ч/Б", title: "Собор, ч/б", series: "Разное", tags: ["Графика", "Типографика"], ratio: 0.6773, cover: "content/posters/cathedral-bw-s.webp", image: "content/posters/cathedral-bw.webp" },
    { id: "this-summer", vibe: "Тёплое", title: "Этим летом", series: "Разное", tags: ["Фото", "Типографика"], ratio: 0.7067, cover: "content/posters/this-summer-s.webp", image: "content/posters/this-summer.webp" },
    { id: "nymphaea", vibe: "Кислота", title: "Nymphaea", series: "Разное", tags: ["Интерфейс", "Коллаж"], ratio: 0.7068, cover: "content/posters/nymphaea-s.webp", image: "content/posters/nymphaea.webp" },
    { id: "kawaii-dog", vibe: "Кислота", title: "Очень милый пёс", series: "Разное", tags: ["Коллаж", "Типографика"], ratio: 0.7068, cover: "content/posters/kawaii-dog-s.webp", image: "content/posters/kawaii-dog.webp" },
    /* KARAS STUDIO */
    { id: "studio-top100", vibe: "Кислота", title: "Top 100 лучших дизайнеров", series: "KARAS STUDIO", year: 2025, tags: ["Типографика", "Графика"], ratio: 0.7068, cover: "content/posters/studio-top100-s.webp", image: "content/posters/studio-top100.webp" },
    { id: "studio-ufo", vibe: "Неон", title: "Тренды на 2026 год", series: "KARAS STUDIO", year: 2026, tags: ["Типографика", "3D"], ratio: 0.7068, cover: "content/posters/studio-ufo-s.webp", image: "content/posters/studio-ufo.webp" },
    { id: "studio-renaissance", vibe: "Тёплое", title: "Эпоха возрождения как вдохновение", series: "KARAS STUDIO", tags: ["Типографика", "Коллаж"], ratio: 0.7068, cover: "content/posters/studio-renaissance-s.webp", image: "content/posters/studio-renaissance.webp" },
  ],

  articles: [
    {
      id: "kak-sdelat-portfolio",
      title: "Как сделать сайт-портфолио: от контента до своего домена",
      date: "2026-10-24",
      author: "Karas Studio",
      tags: ["Нейросети", "Гайд", "Сайт"],
      read: 12,
      cover: "content/articles/kak-sdelat-portfolio/banner.webp",
      lead: "Как собрать свой сайт с помощью нейросети, без кода и конструкторов: контент, референсы, промты, мобильная версия и публикация на свой домен.",
      bodyScript: "content/articles/kak-sdelat-portfolio/article.js",
    },
    {
      id: "nano-banana-2",
      title: "Как генерировать изображение в Nano Banana: референсы, объединение Ч.2",
      date: "2026-01-21",
      author: "Karas Studio",
      tags: ["Нейросети", "Гайд"],
      read: 17,
      cover: "content/articles/nano-banana-2/frame-113.webp",
      lead: "Работа с референсами, объединение нескольких изображений в одном кадре и готовые промты для предметки, мерча и персонажей.",
      bodyScript: "content/articles/nano-banana-2/article.js",
      source: "https://telegra.ph/Kak-generirovat-izobrazheniem-v-Nano-Banana-referensy-obedinenie-CH2-01-21",
    },
    {
      id: "nano-banana-1",
      title: "Nano Banana ГАЙД: фотореализм, промты, ошибки (бесплатно) Ч.1",
      date: "2025-12-15",
      author: "Karas Studio",
      tags: ["Нейросети", "Гайд"],
      read: 12,
      cover: "content/articles/nano-banana-1/group-250.webp",
      lead: "В этой статье разберём, где найти Nano Banana, как получить доступ и как использовать на практике.",
      bodyScript: "content/articles/nano-banana-1/article.js",
      source: "https://telegra.ph/Kak-podklyuchit-Nano-Banana-besplatno-12-15",
    },
    /* Ниже — черновые примеры. draft: true — на сайте не видны. */
    {
      id: "plate-system",
      draft: true,
      title: "Плашка как система: почему мой логотип живёт на прямоугольнике",
      date: "2026-07-02",
      tags: ["Айдентика"],
      read: 5,
      cover: null, seed: 202, art: "plate",
      lead: "Разбираю, как одна плашка собирает весь бренд от аватарки до футболки.",
      body: [{ p: "Черновик статьи." }],
    },
    {
      id: "acid-color",
      draft: true,
      title: "Кислотный цвет без боли",
      date: "2026-04-11",
      tags: ["Цвет"],
      read: 4,
      cover: null, seed: 203, art: "beam",
      lead: "Как работать с лаймом, чтобы он кричал, но не резал глаза.",
      body: [{ p: "Черновик статьи." }],
    },
    {
      id: "poster-routine",
      draft: true,
      title: "Один плакат в неделю: что я понял за год",
      date: "2025-12-20",
      tags: ["Плакаты", "Процесс"],
      read: 6,
      cover: null, seed: 204, art: "smotri",
      lead: "52 плаката, 3 провала и одна серия, которая стала брендом.",
      body: [{ p: "Черновик статьи." }],
    },
  ],
};
