import csv
import pandas as pd
from io import StringIO

# URL для загрузки CSV напрямую
url = "https://raw.githubusercontent.com/ip2location/ip2location-iata-icao/master/iata-icao.csv"

df = pd.read_csv(url)

# Данные из rus_airports.csv в виде строки (разделитель — ;)
# ps я знаю что это говнокод, но у меня реально не было времени сделать это адекватно через редис(
rus_airports_data = """iata;icao;rus
ABA;UNAA;Абакан
DYR;UHMA;Угольный
AAQ;URKA;Витязево
ARH;ULAA;Талаги
ASF;URWA;Астрахань
BAX;UNBB;Михайловка
EGO;UUOB;Белгород
BQS;UHBB;Игнатьево
BTK;UIBB;Братск
BZK;UUBP;Брянск
VRI;ULDW;Варандей
VVO;UHWW;Кневичи
OGZ;URMO;Беслан
VOG;URWW;Гумрак
VOZ;UUOO;Воронеж
GRV;URMG;Северный
SVX;USSS;Кольцово
ZIA;UUBW;Раменское
IKT;UIII;Иркутск
KZN;UWKD;Казань
KGD;UMKK;Храброво
KLF;UUBC;Грабцево
KEJ;UNEE;Кемерово
KRR;URKK;Пашковский
KJA;UNKL;Емельяново
KRO;USUU;Курган
URS;UUOK;Восточный
LPK;UUOL;Липецк
IGT;URMS;Магас
GDX;UHMM;Сокол
MQF;USCM;Магнитогорск
MCX;URML;Уйташ
MRV;URMM;Минеральные Воды
VKO;UUWW;Внуково
DME;UUDD;Домодедово
SVO;UUEE;Шереметьево
MMK;ULMM;Мурманск
NAL;URMN;Нальчик
NJC;USNN;Нижневартовск
NBC;UWKE;Бегишево
GOJ;UWGG;Стригино
NOZ;UNWW;Спиченково
OVB;UNNT;Толмачёво
NSK;UOOO;Норильск
OMS;UNOO;Омск
REN;UWOO;Оренбург
OSW;UWOR;Орск
OSF;UUMO;Остафьево
PEE;USPP;Большое Савино
PES;ULPB;Бесовец
PKC;UHPP;Елизово
PVS;UHMD;Провидения
PKV;ULOO;Кресты
ROV;URRP;Платов
SBT;USDA;Сабетта
KUF;UWWW;Курумоч
LED;ULLI;Пулково
SKX;UWPS;Саранск
GSV;UWSG;Гагарин
SIP;UKFF;Симферополь
AER;URSS;Адлер
STW;URMT;Шпаковское
SGC;USRR;Сургут
SCW;UUYY;Сыктывкар
RMZ;USTJ;Ремезов
TOF;UNTT;Богашёво
TJM;USTR;Рощино
UUD;UIUU;Мухино
ULV;UWLL;Баратаевка
ULY;UWLW;Восточный
UFA;UWUU;Уфа
KHV;UHHH;Новый
HMA;USHH;Ханты-Мансийск
CSY;UWKS;Чебоксары
CEK;USCC;Челябинск
CEE;ULWC;Череповец
HTA;UIAA;Кадала
ESL;URWI;Элиста
UUS;UHSS;Хомутово
YKS;UEEE;Якутск
IAR;UUDL;Туношна
VGD;ULWW;Вологда
RGK;UNBG;Горно-Алтайск
IWA;UUBI;Южный
JOK;UWKJ;Йошкар-Ола
KVX;USKK;Победилово
KMW;UUBA;Сокеркино
KYZ;UNKY;Кызыл
NNM;ULAM;Нарьян-Мар
PEZ;UWPP;Пенза
SLY;USDD;Салехард
KVK;ULMK;Хибины
"""


def get_airport_id(name):
    csv_data = StringIO(rus_airports_data)
    reader = csv.reader(csv_data, delimiter=';')

    for row in reader:
        if len(row) < 3:
            continue

        iata, icao, rus = row[0].strip(), row[1].strip(), row[2].strip()

        if rus.lower() == name.lower():
            return iata if iata else icao

    return None


def get_airport_by_code(code, df):
    result = df[(df["iata"] == code) | (df["icao"] == code)]
    return result.to_dict(orient="records")[0] if not result.empty else None


def get_data_airport_by_code_from_yandex(rus_name):
    airport_id = get_airport_id(rus_name)
    if not airport_id:
        return f"Аэропорт '{rus_name}' не найден"

    return get_airport_by_code(airport_id, df)
