const belowTwenty = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen"
];
const tens = [
    "", "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety"
];
const thousands = [
    "",
    "Thousand",
    "Million",
    "Billion"
];

export const numberToWords = (num) => {
    if (num === 0) return "Zero";
    let words = "";
    let i = 0;
    while (num > 0) {
        if (num % 1000 !== 0) {
            words = `${convertLessThanThousand(num % 1000)} ${thousands[i]} ${words}`;
        }
        num = Math.floor(num / 1000);
        i++;
    }
    return words.trim();
};

const convertLessThanThousand = (num) => {
    if (num === 0) return "";
    else if (num < 20) return belowTwenty[num];
    else if (num < 100) return `${tens[Math.floor(num / 10)]} ${belowTwenty[num % 10]}`;
    else return `${belowTwenty[Math.floor(num / 100)]} Hundred ${convertLessThanThousand(num % 100)}`;
};
