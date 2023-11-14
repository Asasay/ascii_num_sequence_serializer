const { serialize, deserialize } = require("./index");

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function dublicateItems(arr, numberOfRepetitions) {
  return arr.flatMap((i) =>
    Array.from({ length: numberOfRepetitions }).fill(i)
  );
}

function generateSequence(length, min, max) {
  return Array.from({ length: length }, () => randomIntFromInterval(min, max));
}

function testWithInitialValue(initialValue) {
  const sortedInitial = initialValue.sort((a, b) => a - b);
  const serialized = serialize(initialValue);
  const deserialized = deserialize(serialized);

  expect(deserialized).toEqual(sortedInitial);

  const noCompressionLength = JSON.stringify(initialValue).length - 2;
  const compressedLength = serialized.length;
  const compressionRatio = noCompressionLength / compressedLength;

  // expect(compressionRatio).toBeGreaterThan(2);

  console.log("Initial array: ", sortedInitial);
  console.log("Resulting string: ", serialized);
  // console.log("Deserialized sequence: ", deserialized);
  // console.log("Length without compression", noCompressionLength);
  // console.log("Length with compression", compressedLength);
  console.log("Compression ratio", compressionRatio);
}

test("simple", () => {
  testWithInitialValue([3, 0, 0, 8, 1, 12, 12, 112, 212, 232]);
});

test("50x1000, length: 1000 fill: 50", () => {
  testWithInitialValue(Array(1000).fill(50));
});

test("random 50, length: 50 range: 0-300", () => {
  testWithInitialValue(generateSequence(50, 0, 300));
});

test("random 100, length: 100 range: 0-300", () => {
  testWithInitialValue(generateSequence(100, 0, 300));
});

test("random 500, length: 500 range: 0-300", () => {
  testWithInitialValue(generateSequence(500, 0, 300));
});

test("random 1000, length: 1000 range: 0-300", () => {
  testWithInitialValue(generateSequence(1000, 0, 300));
});

test("random, length: 1000 range: 0-100", () => {
  testWithInitialValue(generateSequence(1000, 0, 100));
});

test("3 digits random, length: 1000 range: 200-300", () => {
  testWithInitialValue(generateSequence(1000, 200, 300));
});

test("2 digits random, length: 1000 range: 10-99", () => {
  testWithInitialValue(generateSequence(1000, 10, 99));
});

test("1 digit random, length: 1000 range: 0-9", () => {
  testWithInitialValue(generateSequence(1000, 0, 9));
});

test("3x each, length: 900 range: 0-299", () => {
  const zeroTo299 = Array.from({ length: 300 }, (_, k) => k);
  const duplicated = dublicateItems(zeroTo299, 3);
  testWithInitialValue(duplicated);
});
