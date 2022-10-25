# Бот для мониторинга курса Евро

### Как использовать:
* Клонируем и в корне создаем файл `.env`, в нем прописываем `TOKEN='вашТокенОтБотаТут'`
* Запускаем (`npm run start`)
* Ищем бота в Telegram
* Вводим `/start`, а затем желаемый курс для мониторинга (например, 88)
* Бот сообщит, как только курс евро будет больше или равен установленного

### Misc
Бот создавался весной 22 года, когда курс евро резко вырос.
Было бы полезно знать, что курс стал выгодным и можно
продавать валюту, но постоянно мониторить неудобно, поэтому
и решил написать бота.
Уверен, что в интернете было подобное решение (и не одно),
но решил попробовать написать своего.
Никакой документации к АПИ Тинькова не искал, просто через
девтулзы вытащил запрос, вроде работает :)