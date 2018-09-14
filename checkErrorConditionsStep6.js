class ArrayParser {
  constructor() {
    this.item = {
      type: "array",
      child: []
    };
    this.lastChildArrStack = [];
  }

  getArrayParser(str) {
    const trimBlank = this.getTrimBlank(str);
    const stringData = this.splitStringData(trimBlank);
    const bracketError = this.checkBracketError(stringData);
    const colonError = this.getColonError(stringData);
    const parseData = this.getParseData(stringData);
    return parseData;
  }

  getTrimBlank(str) {
    return str.split(' ').join("");
  }

  splitStringData(str) {
    let strToken = "";

    for (let value of str) {
      if (this.checkIfOpenSquareBracket(value)) {
        strToken += value + ",";
      }
      else if (this.checkIfOpenCurlyBracket(value)) {
        strToken += value + ",";
      }
      else if (this.checkIfCloseBrackets(value)) {
        strToken += "," + value;
      }
      else if (this.checkIfColon(value)) {
        strToken += value + ","
      }
      else if (this.checkIfElseStrings(value)) {
        strToken += value;
      }
    }
    const result = strToken.split(",");
    console.log(result);
    return result;
  }

  checkIfOpenSquareBracket(valueOfStr) {
    let isOpenSquareBracket = false;
    if (valueOfStr === "[") isOpenSquareBracket = true;
    return isOpenSquareBracket;
  }

  checkIfOpenCurlyBracket(valueOfStr) {
    let isOpenCurlyBracket = false;
    if (valueOfStr === "{") isOpenCurlyBracket = true;
    return isOpenCurlyBracket;
  }

  checkIfCloseBrackets(valueOfStr) {
    let isCloseBracket = false;
    if (valueOfStr === "]" || valueOfStr === "}") isCloseBracket = true;
    return isCloseBracket;
  }

  checkIfColon(valueOfStr) {
    let isColon = false;
    if (valueOfStr === ":") isColon = true;
    return isColon;
  }

  checkIfElseStrings(valueOfStr) {
    let isElseStrings = false;
    if (valueOfStr !== ":") isElseStrings = true;
    return isElseStrings;
  }

  checkBracketError(stringData) {
    const bracketsCountObj = {
      numSquareBracket: 0,
      numCurlyBracket: 0,
    }
    this.getBracketCount.call(bracketsCountObj, stringData);
    this.throwBracketErrorMsg.call(bracketsCountObj);
  }

  getBracketCount(stringData) {
    stringData.forEach((element, index) => {
      if (element === "[") this.numSquareBracket++;
      else if ((element === "]")) this.numSquareBracket--;
      else if ((element === "{")) this.numCurlyBracket++;
      else if ((element === "}")) this.numCurlyBracket--;
    });
  }

  throwBracketErrorMsg() {
    if (this.numSquareBracket !== 0) {
      throw new Error(`정상적으로 종료되지 않은 배열이 있습니다.`);
    }
    else if (this.numCurlyBracket !== 0) {
      throw new Error(`정상적으로 종료되지 않은 객체가 있습니다.`);
    }
  }

  getColonError(stringData) {
    stringData.forEach((element, index) => {
      const nextIndex = index + 1;
      if (this.checkIfOpenCurlyBracket(element)) this.getColonErrorMsg(stringData, nextIndex);
      else if (this.getIsColon(element)) this.getErrorMsgThatNeedVal(stringData, nextIndex);
    });
  }

  getIsColon(value) {
    let isColon = false;
    if (/:/.test(value)) isColon = true;
    return isColon;
  }

  getColonErrorMsg(stringData, nextIndex) {
    if (!this.getIsColon(stringData[nextIndex])) {
      throw new Error(`':'이 누락된 객체표현이 있습니다.`);
    }
  }

  getErrorMsgThatNeedVal(stringData, nextIndex) {
    if (!stringData[nextIndex]) {
      throw new Error(`value 값이 누락되었습니다.`);
    }
  }

  getParseData(splitStringData) {
    const arrayParserItem = this.item.child;
    let lastChildArr = arrayParserItem;

    for (let value of splitStringData) {
      if (value === "null") {
        const newNumBooleanObj = new dataSampleClass({ type: "object", value: value });
        lastChildArr.push(newNumBooleanObj);
      }
      else if (value === "false" || value === "true") {
        const newNumBooleanObj = new dataSampleClass({ type: "boolean", value: value });
        lastChildArr.push(newNumBooleanObj);
      }
      else if (!isNaN(value) && value !== "") {
        const newNumTypeObj = new dataSampleClass({ type: "number", value: value });
        lastChildArr.push(newNumTypeObj);
      }
      else if (value !== "") {
        lastChildArr = this.getLastChildArr(lastChildArr, value);
      }
    }
    return arrayParserItem;
  }

  getLastChildArr(lastChildArr, valOfSplitStrData) {
    if (this.checkIfOpenSquareBracket(valOfSplitStrData)) {
      const newArrTypeObj = new dataSampleClass({ type: "array", value: "arrayObj" });
      this.getlastArrChildStack(lastChildArr, newArrTypeObj);
    }
    else if (this.checkIfOpenCurlyBracket(valOfSplitStrData)) {
      const newObjTypeObj = new dataSampleClass({ type: "object" });
      this.getlastArrChildStack(lastChildArr, newObjTypeObj);
    }
    else if (this.checkIfCloseBrackets(valOfSplitStrData)) {
      this.lastChildArrStack.pop();
    }
    else if (this.getIsColon(valOfSplitStrData)) {
      valOfSplitStrData = valOfSplitStrData.replace(/:/, "")
      const newKeyTypeObj = new dataSampleClass({ type: "string", key: valOfSplitStrData });
      this.getlastArrChildStack(lastChildArr, newKeyTypeObj);
    }
    else {
      this.getStrTypeError(valOfSplitStrData);
      const newStrTypeObj = new dataSampleClass({ type: "string", value: valOfSplitStrData });
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
      throw Error(`${currentVal}는 올바른 문자열이 아닙니다.`);
    }
  }

  checkUnKnownTypeError(currentVal) {
    const unKnownType = currentVal.match(/\d{1}[a-z]{1}/gi);
    if (unKnownType) {
      throw Error(`${currentVal}는 알 수 없는 타입입니다.`);
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

const parseStr = new ArrayParser();
const testcase = "[1,[2,[3],4],5]";
const testcase1 = "[1,[2]]";
const testcase2 = "['1',[         2]]";
const testcase3 = "[1,[2,[[3,4,[10,12],60],9]],7,8]";
const testcase4 = "[{]}";
const testcase5 = "[123,[22,23,[11,112],55],33]";
const testcase6 = "['1a3',[null,false,['11',[112233],112],55,99],33, true]";
const testcase7 = "['1'a'3',[null,false,['11',[112233],{easy : ['hello', {a:'a'}, 'world']},112],55, '99'],{a:'str', b:[912,[5656,33],{key : 'innervalue', newkeys: [1,2,3,4,5]}]}, true]";
const testcase8 = "['13',{a: 'str'},2]";
const testcase9 = "[{a:'b}]";
const testcase10 = "[{newkeys: [1,2,3,4,5]]}";
const testcase11 = "[{a:}]";
const testcase12 = "['1a3',[null,false],['11',112,'99'], {a:'str', b:c}, true]";
const testcase13 = "['13',[null,false,['11',112,'99' , {a:'str', b:c}, true]]]";

console.log(JSON.stringify(parseStr.getArrayParser(testcase4), null, 2));