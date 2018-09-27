const StringDataTokenizer = require('./stringDataTokenizer.js');
const ArrayParser = require('./arrayParserMain.js');
const Expect = require('./expect.js');

const test = (msg, showfunction) => {
  console.log(msg);
  return showfunction();
}

console.log(test("TEST", function () {
  const testCase = "[1,[2,[3],4],5]";
  const answer =
    [
      {
        "type": "array",
        "value": "arrayObj",
        "child": [
          {
            "type": "number",
            "value": "1",
            "child": []
          },
          {
            "type": "array",
            "value": "arrayObj",
            "child": [
              {
                "type": "number",
                "value": "2",
                "child": []
              },
              {
                "type": "array",
                "value": "arrayObj",
                "child": [
                  {
                    "type": "number",
                    "value": "3",
                    "child": []
                  }
                ]
              },
              {
                "type": "number",
                "value": "4",
                "child": []
              }
            ]
          },
          {
            "type": "number",
            "value": "5",
            "child": []
          }
        ]
      }
    ]
  const tokenizedStrArr = new StringDataTokenizer(testCase);
  const result = new ArrayParser(tokenizedStrArr.getTokenizedStrArr());
  const expect = new Expect(JSON.stringify(answer, null, 2));
  return expect.isEqual(JSON.stringify(result.getArrayParser(), null, 2));
}));