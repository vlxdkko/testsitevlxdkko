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

// Получаем id товара из URL
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Основная функция для загрузки данных товара и их отображения
async function loadProductDetails() {
    try {
        const productId = getProductIdFromURL();
        const products = await fetchCSV('products.csv');
        const descriptions = await fetchCSV('descriptions.csv');

        const product = products.find(p => p.id === productId);
        const description = descriptions.find(d => d.id === productId);

        if (!product || !description) {
            console.error('Товар не найден');
            return;
        }

        // Создаем HTML-код для страницы товара
        const productDetails = document.getElementById('product-details');
        productDetails.innerHTML = `
            <h1>${product.name}</h1>
            <img src="${product.image}" alt="${product.name}">
            <p>${description.description}</p>
            <label for="quantity-select">Количество:</label>
            <select id="quantity-select">
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="10">10</option>
            </select>
            <p id="price">Цена: ${description.price_2} руб.</p>
            <button id="add-to-cart">В корзину</button>
        `;

        // Изменение цены при изменении количества товара
        const quantitySelect = document.getElementById('quantity-select');
        const priceElement = document.getElementById('price');

        quantitySelect.addEventListener('change', function() {
            const selectedQuantity = parseInt(this.value);
            let price;

            if (selectedQuantity === 2) {
                price = description.price_2;
            } else if (selectedQuantity === 5) {
                price = description.price_5;
            } else if (selectedQuantity === 10) {
                price = description.price_10;
            }

            priceElement.textContent = `Цена: ${price} руб.`;
        });

    } catch (error) {
        console.error(`Ошибка при загрузке данных товара: ${error.message}`);
    }
}

// Инициализируем загрузку данных товара при загрузке страницы
document.addEventListener('DOMContentLoaded', loadProductDetails);

// Обработчик для кнопки "Закрыть", который возвращает на главную страницу
document.getElementById('close-button').addEventListener('click', function() {
    window.location.href = 'index.html';
});
