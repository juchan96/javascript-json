const StringDataTokenizer = require('./stringDataTokenizer.js');
const TokenErrorChecker = require('./tokenErrorChecker.js');
const ArrayParser = require('./arrayParserMain.js');
const Expect = require('./expect.js');

const test = (msg, showfunction) => {
  return `${msg} ${showfunction()} \n`;
}

const testArrayParser = test("ArrayParser Class가 잘 동작한다.", function () {
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
  const errorChecker = new TokenErrorChecker(tokenizedStrArr.getTokenizedStrArr())
  try {
    errorChecker.getCheckTokenError();
  }
  catch (e) {
    console.log( e)
  }

  const result = new ArrayParser(tokenizedStrArr.getTokenizedStrArr());
  const expect = new Expect(JSON.stringify(answer, null, 2));
  return expect.isEqual(JSON.stringify(result.getArrayParser(), null, 2));
});

const testSplitingStrData = test("StringDataTokenizer 클래스의 splitStringData 메소드가 잘 동작한다.", function () {
  const testCase = "[1,[null,false,['11',[112233],112],55,99],33, true]";
  const answer = ["[", "1", "[", "null", "false", "[", "'11'", "[", "112233", "]", "112", "]", "55", "99", "]", "33", "true", "]"]
  const tokenizedStrArr = new StringDataTokenizer(testCase);
  const errorChecker = new TokenErrorChecker(tokenizedStrArr.getTokenizedStrArr())
  try {
    errorChecker.getCheckTokenError();
  }
  catch (e) {
    console.log( e)
  }

  const trimmedData = tokenizedStrArr.getTrimBlank(testCase);
  const result = tokenizedStrArr.splitStringData(trimmedData);
  const expect = new Expect(JSON.stringify(answer, null, 2));
  return expect.isEqual(JSON.stringify(result, null, 2));
});

console.log(testArrayParser, testSplitingStrData)