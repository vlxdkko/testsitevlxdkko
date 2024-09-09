// Функция для чтения CSV-файлов
function fetchCSV(file) {
    return fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки файла: ${file}`);
            }
            return response.text();
        })
        .then(data => {
            const lines = data.split("\n");
            const headers = lines[0].split(",");
            return lines.slice(1).map(line => {
                const values = line.split(",");
                const obj = {};
                headers.forEach((header, i) => {
                    obj[header.trim()] = values[i] ? values[i].trim() : "";
                });
                return obj;
            });
        })
        .catch(error => {
            console.error(`Ошибка при чтении CSV файла: ${error.message}`);
        });
}

// Функция для отображения товаров
function displayProducts(products) {
    const catalog = document.getElementById('catalog');
    catalog.innerHTML = ''; // Очищаем каталог перед повторной отрисовкой

    products.forEach(product => {
        const productHTML = `
            <div class="product">
                <h2 class="product-name"><a href="product.html?id=${product.id}">${product.name}</a></h2>
                <img src="${product.image}" alt="${product.name}">
            </div>
        `;
        catalog.insertAdjacentHTML('beforeend', productHTML);
    });
}

// Функция для поиска товаров
function filterProducts(products, searchQuery) {
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    displayProducts(filteredProducts);
}

// Основная функция для загрузки товаров и реализации поиска
async function loadAndSearchProducts() {
    try {
        const products = await fetchCSV('products.csv');

        // Отображаем все товары при загрузке страницы
        displayProducts(products);

        // Добавляем обработчик для поиска
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', function() {
            const searchQuery = searchInput.value;
            filterProducts(products, searchQuery);
        });
    } catch (error) {
        console.error(`Ошибка при загрузке товаров: ${error.message}`);
    }
}

// Инициализация поиска при загрузке страницы
document.addEventListener('DOMContentLoaded', loadAndSearchProducts);

// Выдвижное меню
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
const body = document.body;

// Открытие/закрытие меню при нажатии на кнопку
menuToggle.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
});

// Закрытие меню при нажатии на любую другую часть страницы
body.addEventListener('click', (e) => {
    if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        sideMenu.classList.remove('open');
    }
});
