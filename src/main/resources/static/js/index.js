document.addEventListener('DOMContentLoaded', function() {
    // Определение активного пункта меню
    const currentPath = window.location.pathname;
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('th:href');
        if (href === '@{/}' && (currentPath === '/' || currentPath === '')) {
            link.classList.add('active');
        } else if (href && currentPath.includes(href.replace('@{', '').replace('}', ''))) {
            link.classList.add('active');
        }
    });

    // Эффект прокрутки для плавного скролла до якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


});