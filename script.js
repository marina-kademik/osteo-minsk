document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.getElementById('menuToggleBtn');
    const closeBtn = document.getElementById('closeSidebarBtn');

    function openMenu() {
        sidebar?.classList.add('open');
        overlay?.classList.add('active');
        document.body.classList.add('menu-open');
    }

    function closeMenu() {
        sidebar?.classList.remove('open');
        overlay?.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    ['click', 'touchstart'].forEach(eventType => {
        menuBtn?.addEventListener(eventType, (e) => {
            e.preventDefault();
            openMenu();
        });
    });
    closeBtn?.addEventListener('click', closeMenu);
    overlay?.addEventListener('click', closeMenu);

    // Закрытие меню при клике по ссылке навигации на мобилках
    sidebar?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                closeMenu();
            }
        });
    });

    // Закрытие по Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // Подсветка активного пункта меню при скролле
    const navLinks = [...sidebar?.querySelectorAll('a[href^="#"]') || []];

    function setActiveLink(id) {
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isActive);
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const id = link.getAttribute('href').slice(1);
            setActiveLink(id);
        });
    });

    const sections = navLinks
        .map(link => {
            const href = link.getAttribute('href');
            return href.startsWith('#') ? document.querySelector(href) : null;
        })
        .filter(Boolean);

    function updateActiveSection() {
        if (sections.length === 0) return;
        const scrollPos = window.scrollY + 180;
        let currentSection = sections[0];

        sections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                currentSection = section;
            }
        });

        if (currentSection) {
            setActiveLink(currentSection.id);
        }
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();

    // ==========================================
    // ЗАЩИТА КОНТЕНТА ОТ КОПИРОВАНИЯ И СКАЧИВАНИЯ
    // ==========================================

    // 1. Отключение правого клика мыши
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // 2. Блокировка горячих клавиш (Ctrl+C, Ctrl+U, F12 и т.д.)
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || // DevTools
            (e.ctrlKey && (e.key === 'u' || e.key === 'U')) || // Просмотр кода (Ctrl+U)
            (e.ctrlKey && (e.key === 'c' || e.key === 'C')) || // Копировать (Ctrl+C)
            (e.ctrlKey && (e.key === 'a' || e.key === 'A'))    // Выделить всё (Ctrl+A)
        ) {
            e.preventDefault();
            return false;
        }
    });

    // 3. Запрет на перетаскивание картинок и текста
    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });
});