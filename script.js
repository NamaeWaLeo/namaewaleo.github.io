document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const navLinks = document.querySelectorAll('.mobile-nav-menu a');

    menuToggle.addEventListener('click', () => {
        mobileNavMenu.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavMenu.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        });
    });

    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                if (entry.target.classList.contains('content-section')) {
                    const childRules = entry.target.querySelectorAll('.rule-group');
                    childRules.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animated');
                        }, index * 100);
                    });
                    const keyRuleCards = entry.target.querySelectorAll('.rule-card');
                    keyRuleCards.forEach((card, index) => {
                         setTimeout(() => {
                            card.classList.add('animated');
                        }, index * 100);
                    });
                }
                if (entry.target.classList.contains('summary-section')) {
                    const summaryParagraphs = entry.target.querySelectorAll('.summary-content p');
                    summaryParagraphs.forEach((p, index) => {
                        setTimeout(() => {
                            p.classList.add('fade-in');
                        }, index * 300);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(element => {
        observer.observe(element);
    });

    const heroContent = document.querySelector('.hero-content');
    heroContent.classList.add('fade-in');

    const emphasisKeywords = [
        "금지", "제재", "엄격히", "조치", "차단", "준수", "책임", "자제해 주세요", "처리", "경고"
    ];

    const contentAreas = document.querySelectorAll('.rule-group, .rule-card, .summary-section');

    contentAreas.forEach(area => {
        const walker = document.createTreeWalker(
            area,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (node.parentNode.nodeName === 'SCRIPT' || node.parentNode.nodeName === 'STYLE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (node.parentNode.classList.contains('emphasize-text') || node.parentNode.classList.contains('emphasis-pill')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        let node;
        let nodesToProcess = [];

        while (node = walker.nextNode()) {
            nodesToProcess.push(node);
        }

        nodesToProcess.forEach(node => {
            let originalText = node.nodeValue;
            let newHtml = originalText;
            let changed = false;

            emphasisKeywords.forEach(keyword => {
                const regex = new RegExp(`(${keyword})`, 'gi');
                if (newHtml.match(regex)) {
                    newHtml = newHtml.replace(regex, `<span class="emphasize-text">$&</span><span class="emphasis-pill">주의!</span>`);
                    changed = true;
                }
            });

            if (changed) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newHtml;
                while (tempDiv.firstChild) {
                    node.parentNode.insertBefore(tempDiv.firstChild, node);
                }
                node.parentNode.removeChild(node);
            }
        });
    });

    const searchInputs = [searchInput, mobileSearchInput];

    searchInputs.forEach(input => {
        const searchContext = $("#main-content");

        input.addEventListener('input', (event) => {
            const searchTerm = event.target.value;
            searchContext.unmark();
            if (searchTerm.trim() === '') {
                return;
            }
            searchContext.mark(searchTerm, {
                accuracy: "partially",
                caseSensitive: false,
                separateWordSearch: false,
                ignoreJoiners: true,
                acrossElements: true
            });
        });
    });
});
