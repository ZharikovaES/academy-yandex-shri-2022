function main(n, width, height) {
	const columns = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / columns);
    const widthCell = Math.round(width / columns);
    const heightCell = Math.round(height / columns);
    const remainder = n % columns;

    let result = [];

    for (let i = 0; i < n; i++)
        result.push({ width: widthCell, height: heightCell });

    //расчет координат, высоты и ширины для карточек первой строки раскладки, которые полностью не заполяют всю строку
    if (remainder > 0)
        for (let i = 0; i < remainder; i++) {
    		result[i].x = Math.round((width - remainder * widthCell) / 2 + i * widthCell);
            result[i].y = Math.round((height - rows * (height / columns)) / 2);
            result[i].width = widthCell;
            result[i].height = heightCell;
		}

    //расчет координат, высоты и ширины для остальных карточек раскладки, которые полностью заполяют всю строку
    for (let i = remainder; i < n; i++) {
        result[i].x = Math.round(((i - remainder) % columns) * widthCell);
        result[i].y = Math.round((height - rows * (height / columns)) / 2 + (Math.ceil(((i - remainder + 1) / rows) - Number(!remainder)) * (height / columns)));
        result[i].width = widthCell;
        result[i].height = heightCell;
    }
	return result;
}

console.log(main(7, 1280, 720));