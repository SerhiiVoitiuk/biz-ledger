import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parse, format } from "date-fns";
import { uk } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const formatPrice = (price: string | number): string => {
  const parsedPrice =
    typeof price === "number"
      ? price
      : parseFloat(price.replace(/\s/g, "").replace(",", "."));

  if (isNaN(parsedPrice)) {
    return "Invalid price";
  }

  return parsedPrice.toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function formatQuantity(quantity: string): string {
  if (quantity.includes(".00")) {
    return quantity.split(".")[0];
  }

  return quantity;
}

export const getUnitValue = (unit: string): UnitType => {
  const validUnits: UnitType[] = ["кг", "г", "т", "л", "шт"];
  return validUnits.includes(unit as UnitType) ? (unit as UnitType) : "кг";
};

export const formatUkrainianDate = (input: string): string => {
  const parsedDate = parse(input, "dd.MM.yyyy", new Date());
  return format(parsedDate, "dd MMMM yyyy", { locale: uk });
};

function priceToWords(num: number): string {
  const ones = [
    "",
    "одна",
    "дві",
    "три",
    "чотири",
    "п’ять",
    "шість",
    "сім",
    "вісім",
    "дев’ять",
    "десять",
    "одинадцять",
    "дванадцять",
    "тринадцять",
    "чотирнадцять",
    "п’ятнадцять",
    "шістнадцять",
    "сімнадцять",
    "вісімнадцять",
    "дев’ятнадцять",
  ];

  const tens = [
    "",
    "",
    "двадцять",
    "тридцять",
    "сорок",
    "п’ятдесят",
    "шістдесят",
    "сімдесят",
    "вісімдесят",
    "дев’яносто",
  ];

  const hundreds = [
    "",
    "сто",
    "двісті",
    "триста",
    "чотириста",
    "п’ятсот",
    "шістсот",
    "сімсот",
    "вісімсот",
    "дев’ятсот",
  ];

  const scales = [
    ["", "", "", true], // одиниці
    ["тисяча", "тисячі", "тисяч", true], // тисячі
    ["мільйон", "мільйони", "мільйонів", false], // мільйони
    ["мільярд", "мільярди", "мільярдів", false], // мільярди
  ];

  if (num === 0) return "нуль";

  let result = [];
  let scaleIndex = 0;

  while (num > 0) {
    const group = num % 1000;
    if (group !== 0) {
      const groupWords = getGroupWords(group, scales[scaleIndex][3] as boolean);
      const scaleWord = getScaleWord(group, scales[scaleIndex]);
      result.unshift(`${groupWords} ${scaleWord}`.trim());
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return result.join(" ").replace(/\s+/g, " ").trim();
}

function getGroupWords(num: number, feminine: boolean): string {
  const ones = feminine
    ? [
        "",
        "одна",
        "дві",
        "три",
        "чотири",
        "п’ять",
        "шість",
        "сім",
        "вісім",
        "дев’ять",
      ]
    : [
        "",
        "один",
        "два",
        "три",
        "чотири",
        "п’ять",
        "шість",
        "сім",
        "вісім",
        "дев’ять",
      ];
  const teens = [
    "десять",
    "одинадцять",
    "дванадцять",
    "тринадцять",
    "чотирнадцять",
    "п’ятнадцять",
    "шістнадцять",
    "сімнадцять",
    "вісімнадцять",
    "дев’ятнадцять",
  ];
  const tens = [
    "",
    "",
    "двадцять",
    "тридцять",
    "сорок",
    "п’ятдесят",
    "шістдесят",
    "сімдесят",
    "вісімдесят",
    "дев’яносто",
  ];
  const hundreds = [
    "",
    "сто",
    "двісті",
    "триста",
    "чотириста",
    "п’ятсот",
    "шістсот",
    "сімсот",
    "вісімсот",
    "дев’ятсот",
  ];

  const h = Math.floor(num / 100);
  const t = Math.floor((num % 100) / 10);
  const u = num % 10;

  let result = [];
  if (h) result.push(hundreds[h]);
  if (t === 1) {
    result.push(teens[u]);
  } else {
    if (t) result.push(tens[t]);
    if (u) result.push(ones[u]);
  }

  return result.join(" ");
}

function getScaleWord(
  number: number,
  scale: [string, string, string, boolean | undefined]
): string {
  const lastTwo = number % 100;
  const last = number % 10;

  if (lastTwo >= 11 && lastTwo <= 19) return scale[2];
  if (last === 1) return scale[0];
  if (last >= 2 && last <= 4) return scale[1];
  return scale[2];
}

export function convertToWords(totalAmount: number): string {
  const integerPart = Math.floor(totalAmount); // гривні
  let fractionalPart = Math.round((totalAmount - integerPart) * 100); // копійки

  const wordsForHryvnias = priceToWords(integerPart);
  const hryvniaWord = getHryvniaWord(integerPart);
  const kopiykyWord = getKopiykyWord(fractionalPart);

  return `${capitalize(wordsForHryvnias)} ${hryvniaWord} ${padZero(
    fractionalPart
  )} ${kopiykyWord}`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function padZero(num: number): string {
  return num < 10 ? "0" + num : num.toString();
}

function getHryvniaWord(amount: number): string {
  const lastDigit = amount % 10;
  const lastTwoDigits = amount % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "гривень";
  if (lastDigit === 1) return "гривня";
  if (lastDigit >= 2 && lastDigit <= 4) return "гривні";
  return "гривень";
}

function getKopiykyWord(amount: number): string {
  const lastDigit = amount % 10;
  const lastTwoDigits = amount % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "копійок";
  if (lastDigit === 1) return "копійка";
  if (lastDigit >= 2 && lastDigit <= 4) return "копійки";
  return "копійок";
}

function getUnitWord(amount: number, forms: [string, string, string]): string {
  const lastDigit = amount % 10;
  const lastTwoDigits = amount % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return forms[2];
  if (lastDigit === 1) return forms[0];
  if (lastDigit >= 2 && lastDigit <= 4) return forms[1];
  return forms[2];
}

export function convertToWeightString(
  totalQuantity: number,
  unit: string
): string {
  let result = "";

  if (unit === "кг") {
    const kilograms = Math.floor(totalQuantity);
    const grams = Math.round((totalQuantity - kilograms) * 1000);

    if (kilograms > 0) {
      const kgWords = priceToWords(kilograms);
      const kgUnit = getUnitWord(kilograms, [
        "кілограм",
        "кілограми",
        "кілограмів",
      ]);
      result += `${kgWords} ${kgUnit}`;
    }

    if (grams > 0 || kilograms === 0) {
      const grWords = priceToWords(grams);
      const grUnit = getUnitWord(grams, ["грам", "грами", "грамів"]);
      result += (kilograms > 0 ? " " : "") + `${grWords} ${grUnit}`;
    }
  } else if (unit === "г") {
    const grams = Math.round(totalQuantity);
    const grWords = priceToWords(grams);
    const grUnit = getUnitWord(grams, ["грам", "грами", "грамів"]);
    result = `${grWords} ${grUnit}`;
  } else if (unit === "л") {
    const liters = Math.floor(totalQuantity);
    const milliliters = Math.round((totalQuantity - liters) * 1000);

    if (liters > 0) {
      const lWords = priceToWords(liters);
      const lUnit = getUnitWord(liters, ["літр", "літра", "літрів"]);
      result += `${lWords} ${lUnit}`;
    }

    if (milliliters > 0 || liters === 0) {
      const mlWords = priceToWords(milliliters);
      const mlUnit = getUnitWord(milliliters, [
        "мілілітр",
        "мілілітри",
        "мілілітрів",
      ]);
      result += (liters > 0 ? " " : "") + `${mlWords} ${mlUnit}`;
    }
  } else if (unit === "т") {
    const tons = Math.floor(totalQuantity);
    const kilograms = Math.round((totalQuantity - tons) * 1000);

    if (tons > 0) {
      const tWords = priceToWords(tons);
      const tUnit = getUnitWord(tons, ["тонна", "тонни", "тонн"]);
      result += `${tWords} ${tUnit}`;
    }

    if (kilograms > 0 || tons === 0) {
      const kgWords = priceToWords(kilograms);
      const kgUnit = getUnitWord(kilograms, [
        "кілограм",
        "кілограми",
        "кілограмів",
      ]);
      result += (tons > 0 ? " " : "") + `${kgWords} ${kgUnit}`;
    }
  } else if (unit === "шт") {
    const pieces = Math.round(totalQuantity);
    const pWords = priceToWords(pieces);
    const pUnit = getUnitWord(pieces, ["штука", "штуки", "штук"]);
    result = `${pWords} ${pUnit}`;
  } else {
    result = "Невідома одиниця";
  }

  return result.charAt(0).toUpperCase() + result.slice(1);
}
