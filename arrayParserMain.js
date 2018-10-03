const TokenErrorChecker = require('./tokenErrorChecker.js');
const typeChecker = require('./typeChecker.js');
const StringDataTokenizer = require('./stringDataTokenizer.js');

class ArrayParser {
  constructor(tokenizedStrArr) {
    this.lastChildArrStack = [];
    this.item = {
      type: "array",
      child: []
    };
    this.tokenizedStrArr = tokenizedStrArr;
  }

  getArrayParser() {
    const parsedData = this.getParseData(this.tokenizedStrArr);
    return parsedData;
  }

  getParseData(splitStringData) {
    const arrayParserItem = this.item.child;
    let lastChildArr = arrayParserItem;

    for (let value of splitStringData) {
      if (value === "null") {
        const newNumBooleanObj = new dataSampleClass({
          type: "object",
          value: value
        });
        lastChildArr.push(newNumBooleanObj);
      }
      else if (value === "false" || value === "true") {
        const newNumBooleanObj = new dataSampleClass({
          type: "boolean",
          value: value
        });
        lastChildArr.push(newNumBooleanObj);
      }
      else if (!isNaN(value) && value !== "") {
        const newNumTypeObj = new dataSampleClass({
          type: "number",
          value: value
        });
        lastChildArr.push(newNumTypeObj);
      }
      else if (value !== "") {
        lastChildArr = this.getLastChildArr(lastChildArr, value);
      }
    }
    return arrayParserItem;
  }

  getLastChildArr(lastChildArr, valOfSplitStrData) {
    if (typeChecker.isOpenSquareBracket(valOfSplitStrData)) {
      const newArrTypeObj = new dataSampleClass({
        type: "array",
        value: "arrayObj"
      });
      this.getlastArrChildStack(lastChildArr, newArrTypeObj);
    }
    else if (typeChecker.isOpenCurlyBracket(valOfSplitStrData)) {
      const newObjTypeObj = new dataSampleClass({
        type: "object"
      });
      this.getlastArrChildStack(lastChildArr, newObjTypeObj);
    }
    else if (typeChecker.isCloseBrackets(valOfSplitStrData)) {
      this.lastChildArrStack.pop();
    }
    else if (typeChecker.isColon(valOfSplitStrData)) {
      valOfSplitStrData = valOfSplitStrData.replace(/:/, "")
      const newKeyTypeObj = new dataSampleClass({
        type: "string",
        key: valOfSplitStrData
      });

      this.getlastArrChildStack(lastChildArr, newKeyTypeObj);
    } else {
      this.getStrTypeError(valOfSplitStrData);
      const newStrTypeObj = new dataSampleClass({
        type: "string",
        value: valOfSplitStrData
      });

      lastChildArr.push(newStrTypeObj);
    }

    const lastIdx = this.lastChildArrStack.indexOf([...this.lastChildArrStack].pop());
    lastChildArr = this.lastChildArrStack[lastIdx];
    return lastChildArr;
  }

  getlastArrChildStack(lastChildArr, newTypeObj) {
    lastChildArr.push(newTypeObj);
    const lastIdx = lastChildArr.indexOf([...lastChildArr].pop());
    this.lastChildArrStack.push(lastChildArr[lastIdx]["child"]);
  }

  getStrTypeError(stringData) {
    if (/'/g.test(stringData)) this.checkUnmatchQoutesCount(stringData)
    this.checkUnKnownTypeError(stringData);
  }

  checkUnmatchQoutesCount(currentVal) {
    const numQuotes = (currentVal.match(/'/g)).length;
    if (numQuotes % 2 !== 0) {
      throw `${currentVal}는 올바른 문자열이 아닙니다.`;
    }
  }

  checkUnKnownTypeError(currentVal) {
    const unKnownType = currentVal.match(/\d{1}[a-z]{1}/gi);
    if (unKnownType) {
      throw `${currentVal}는 알 수 없는 타입입니다.`;
    }
  }
}

class dataSampleClass {
  constructor({ type, value, key }) {
    this.type = type;
    this.value = value;
    this.key = key
    this.child = [];
  }
}

module.exports = ArrayParser;