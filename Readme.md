# Axenix Hack
---
## Трек "Аналитика данных" Axeinx:Путешествия легко: простое решение для сложных маршрутов

Разработано MVP приложения для решения создания простых маршрутов для путешествий, которое поможет без проблем добираться из точки А в точку В, указав всего лишь координаты точек, или же названия городов.

Реализовано прокладывание маршрутов, используя следующие виды транспорта:
- Самолет
- Поезд
- Автомобиль
- Велосипед/самокат
- Пешком

При наличии поблизости аэропорта, проверяется, можно ли добраться в пункт B. Если путь оптимальный, строится маршрут от точки А до аэропорта в этом городе, схема перелета, а далее маршрут от аэропорта прилета до точки B.
Аналогичным образом проверяется наличие поездов.

Расчет поездов и самолетов производится путем нахождения самого быстрого времени в пути билета на самолет/поезд из всех возможных вариантов. Используются данные, полученные через сервис [Яндекс.Расписания](https://rasp.yandex.ru).

Расчет движения на автомобиле/велосипеде/пешком рассчитывается, используя некоммерческий картографический проект [OpenStreetMap](https://www.openstreetmap.org/), а именно это открытую библиотеку и сервер для планирования маршрутов [GraphHopper](https://www.graphhopper.com/).

## Алгоритм работы приложения

1. Пользователь вводит начальный и конечный пункт маршрута:
    - если введены **координаты**, переходим к шагу 3
    - если введены **названия городов**, переходим к шагу 2
2. Находим координаты городов, которые необходимы пользователю
3. Далее пользователь вправе выбрать наиболее удобный маршрут(при наличии инфраструктуры, т.е. аэропорта или вокзала):
    - если есть аэропорт и рейсы, пользователю возвращается наиболее удобный маршрут, включающий в себя:
      - движение от точки А до необходимого аэропорта
      - самый короткий по времени перелет до аэропорта в городе назначения
      - движение от аэропорта прибытия до точки B
    - если есть вокзал и билеты, возвращается то же, что и в пункте про аэропорт, только вместо аэропорта понимается вокзал, а вместо перелета перегон поезда дальнего следования или электрички
    - моделируется наилучший маршрут движения на автомобиле. Кроме того, в разработке находится движение на такси, и получение информации о стоимости поездки.
    - моделируется наилучший маршрут движения на велосипеде/средстве индивидуальной мобильности граждан
    - моделируется наикратчайший маршрут движения пешком

На основе полученных данных, пользователь может провести анализ всех предложенных вариантов, и выбрать подходящий.

## Запуск системы и использование.

Для работы с приложением, необходимо:
1. Скачать репозиторий на локальный компьютер
2. В корневой директории создать папку environment, в ней создать файл `.checkpoint-selector.env`. Поместить в него следующую информацию:

```env
API_YANDEX=ТОКЕН_ЯНДЕКС_РАСПИСАНИЙ
API_AVIASALES=ТОКЕН_АВИАСЕЙЛС
API_GRAPHHOOPER=ТОКЕН_ГРАФХУПЕР
```

- API_YANDEX - токен [Яндекс Расписаний](https://rasp.yandex.ru/)
- API_GRAPHHOOPER - токен [GraphHooper](https://www.graphhopper.com/)
- API_AVIASALES - токен [Aviasales](https://aviasales.ru)

3. Запустить сборку
```sh
docker-compose up --build
```
4. Перейти на [http://localhost:5137](http://localhost:5137)

## Взаимодействие с приложением
В настоящее времяя реализован маршрут только по двум точкам, однако как на фронтенде, так и на бэкенде заложена возможность использования сразу нескольких точек для составления маршрутов.

Для выбора точек необходимо ввести соответствующее название объекта, указав город, улицу и т.п., либо указать точку на карте, нажав **левую клавишу мыши** на нужном объекте. 

Нажатием на **правую клавишу мыши** точка удаляется.
## Created by ChillGuys
Подлипалин Виктор (tg @baskhald) - UI/UX Дизайнер

Морев Алексей (tg @Balex777) - Frontend разработчик

Шкитырь Константин (tg @freddiy_jey) - Backend разработчик

Мацегора Дмитрий (tg @qiisqwww) - Backend разработчик

Ерофеев Олег (tg @OlegErofeev1) - ML разработчик