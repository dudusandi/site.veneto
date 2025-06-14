document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const menuLinks = document.querySelectorAll('.menu a');
    const defaultPage = 'inicio';
    const menuToggleBtn = document.getElementById('menu-toggle');
    const menuElement = document.querySelector('.menu');

    const updateActiveLink = (page) => {
        menuLinks.forEach(link => {
            link.parentElement.classList.remove('ativo');
            if (link.getAttribute('href') === page) {
                link.parentElement.classList.add('ativo');
            }
        });
    };

    const fadeOut = () => new Promise(resolve => {
        const handle = () => {
            mainContent.removeEventListener('transitionend', handle);
            resolve();
        };
        mainContent.addEventListener('transitionend', handle);
        // Garante que o evento será disparado mesmo se o navegador não suportar transitionend
        setTimeout(resolve, 450); // 400ms + margem
        // Inicia fade-out
        mainContent.style.opacity = 0;
    });

    const loadCardapioFromDB = async () => {
        const { db } = await import('./firebase-init.js');
        const { ref, onValue } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js');
        const container = document.getElementById('cardapio-container');
        if (!container) return;
        const cardapioRef = ref(db, 'cardapio');
        onValue(cardapioRef, (snapshot) => {
            container.innerHTML = '';
            snapshot.forEach((child) => {
                const item = child.val();
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cardapio-item';
                itemDiv.innerHTML = `
                    <img src="${item.imagem}" alt="${item.nome}">
                    <div class="cardapio-text">
                        <h3>${item.nome}</h3>
                        <p>${item.descricao}</p>
                    </div>
                    <div class="cardapio-price">
                        <p>R$ ${item.preco}</p>
                    </div>`;
                container.appendChild(itemDiv);
            });
        });
    };

    const loadPage = async (page) => {
        await fadeOut();

        if (!page || page === '/') {
            page = defaultPage;
        }

        try {
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) {
                console.error(`Page not found: /pages/${page}.html. Loading default page.`);
                history.replaceState({ page: defaultPage }, '', `/${defaultPage}`);
                await loadPage(defaultPage); 
                return;
            }
            const content = await response.text();
            mainContent.innerHTML = content;
            updateActiveLink(page);
            if (page === 'cardapio') loadCardapioFromDB();
            if (page === 'admin') import('./admin.js');
            // Inicia fade-in na próxima pintura
            requestAnimationFrame(() => {
                mainContent.style.opacity = 1;
            });
        } catch (error) {
            console.error('Error loading page:', error);
            mainContent.innerHTML = '<p>Erro ao carregar o conteúdo. Por favor, tente novamente.</p>';
            requestAnimationFrame(() => {
                mainContent.style.opacity = 1;
            });
        }
    };

    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', () => {
            menuElement.classList.toggle('open');
        });
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = link.getAttribute('href');
            if (location.pathname !== `/${page}`) {
                history.pushState({ page }, '', `/${page}`);
                loadPage(page);
            }
            // Fecha menu mobile após clique
            if (menuElement.classList.contains('open')) {
                menuElement.classList.remove('open');
            }
        });
    });

    window.addEventListener('popstate', (event) => {
        const page = (event.state && event.state.page) || defaultPage;
        loadPage(page);
    });

    const initialPage = location.pathname.substring(1) || defaultPage;
    history.replaceState({ page: initialPage }, '', `/${initialPage}`);
    loadPage(initialPage);
}); 