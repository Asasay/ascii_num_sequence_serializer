function serialize(numbers) {
  const sorted = numbers.sort((a, b) => a - b);
  //Replace numbers except the first with the difference between the current and previous numbers
  const subtracted = sorted.map((n, i, arr) => {
    if (n.toString().length > 16)
      throw new Error("Numbers longer than 16 digits are not supported");
    if (i == 0) return n;
    else return n - arr[i - 1];
  });
  //Prefix each number with a character from the ascii table that encodes the length of the number. The range of characters in the table is from 33 to 47.
  const lengthPrefixed = subtracted.map((n) => {
    const numberLength = n.toString().length;
    if (numberLength > 1) return String.fromCharCode(30 + numberLength) + n;
    else return n;
  });
  const stringified = lengthPrefixed.join("");
  //Encode sequentially more than twice repeated numbers with a symbol from the ascii table. The range of characters in the table is from 58 to 126.
  const repeatingEncoded = stringified.replace(
    /([0-9])\1{2,70}/g,
    (substring) => substring[0] + String.fromCharCode(55 + substring.length)
  );
  return repeatingEncoded;
}

function deserialize(serialized) {
  const repeatingDecoded = serialized.replace(/[0-9][\:-\~]/g, (substring) =>
    Array(substring[1].charCodeAt() - 55)
      .fill(substring[0])
      .join("")
  );
  const charArr = repeatingDecoded.split("");
  const numbersArr = [];
  const result = [];

  for (let i = 0; i < charArr.length; i++) {
    const charCode = charArr[i].charCodeAt();
    if (charCode < 48) {
      for (let k = 0; k < charCode - 30; k++) {
        if (k === 0) numbersArr.push(charArr[i + k + 1]);
        else numbersArr[numbersArr.length - 1] += charArr[i + k + 1];
      }
      i += charCode - 30;
    } else numbersArr.push(charArr[i]);
  }

  numbersArr.map((n, i, arr) => {
    if (i == 0) result.push(Number(n));
    else result.push(parseInt(result[i - 1]) + parseInt(n));
  });

  return result;
}

module.exports = { serialize, deserialize };
