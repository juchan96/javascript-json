class ArrayParser {
  constructor(testcase) {
    this.lastChildArrStack = [];
    this.item = {
      type: "array",
      child: []
    };
    this.tokenizeString = new TokneizeStringData(testcase);
    this.checkStringTokenError = new checkStrTokenError(this.tokenizeString);
    this.stringDataToken = this.tokenizeString.splitSpringData;
    this.checkIfOpenSquareBracket = this.tokenizeString.checkIfOpenSquareBracket;
    this.checkIfOpenCurlyBracket = this.tokenizeString.checkIfOpenCurlyBracket;
    this.checkIfCloseSquareBracket = this.tokenizeString.checkIfCloseSquareBracket;
    this.checkIfCloseCurlyBracket = this.tokenizeString.checkIfCloseCurlyBracket;
    this.checkIfColon = this.tokenizeString.checkIfColon;
  }

  getArrayParser(str) {
    const parseData = this.getParseData(this.stringDataToken);
    this.checkStringTokenError.getCheckTokenError();
    return parseData;
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
    else if (this.checkIfCloseSquareBracket(valOfSplitStrData) || this.checkIfCloseCurlyBracket(valOfSplitStrData)) {
      this.lastChildArrStack.pop();
    }
    else if (this.checkIfColon(valOfSplitStrData)) {
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

class TokneizeStringData {
  constructor(stringData) {
    this.trimBlank = this.getTrimBlank(stringData)
    this.splitSpringData = this.splitSpringData(this.trimBlank)
  }

  getTrimBlank(stringData) {
    return stringData.split(' ').join("");
  }

  splitSpringData(str) {
    let strToken = "";

    for (let value of str) {
      if (this.checkIfOpenSquareBracket(value)) {
        strToken += value + ",";
      }
      else if (this.checkIfOpenCurlyBracket(value)) {
        strToken += value + ",";
      }
      else if (this.checkIfCloseSquareBracket(value) || this.checkIfCloseCurlyBracket(value)) {
        strToken += "," + value;
      }
      else if (this.checkIfColon(value)) {
        strToken += value + ","
      }
      else if (this.checkIfElseStrings(value)) {
        strToken += value;
      }
    }
    const strTokenArr = strToken.split(",");
    console.log(strTokenArr)
    return strTokenArr;
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

  checkIfCloseSquareBracket(valueOfStr) {
    let isCloseBracket = false;
    if (valueOfStr === "]") isCloseBracket = true;
    return isCloseBracket;
  }

  checkIfCloseCurlyBracket(valueOfStr) {
    let isCloseBracket = false;
    if (valueOfStr === "}") isCloseBracket = true;
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
}


class checkStrTokenError {
  constructor(tokenizeString) {
    this.numSquareBracket = 0;
    this.numCurlyBracket = 0;
    this.stringData = tokenizeString.splitSpringData;
    this.checkIfOpenSquareBracket = tokenizeString.checkIfOpenSquareBracket;
    this.checkIfOpenCurlyBracket = tokenizeString.checkIfOpenCurlyBracket;
    this.checkIfCloseSquareBracket = tokenizeString.checkIfCloseSquareBracket;
    this.checkIfCloseCurlyBracket = tokenizeString.checkIfCloseCurlyBracket;
    this.checkIfColon = tokenizeString.checkIfColon;
  }

  getCheckTokenError() {
    this.checkBracketError(this.stringData);
    this.getColonError(this.stringData);
  }

  checkBracketError(stringData) {
    this.getBracketCount(stringData);
    this.throwBracketErrorMsg();
  }

  getBracketCount(stringData) {

    stringData.forEach((element, index) => {
      if (this.checkIfOpenSquareBracket(element)) this.numSquareBracket++;
      else if (this.checkIfCloseSquareBracket(element)) this.numSquareBracket--;
      else if (this.checkIfOpenCurlyBracket(element)) this.numCurlyBracket++;
      else if (this.checkIfCloseCurlyBracket(element)) this.numCurlyBracket--;
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
}

class dataSampleClass {
  constructor({ type, value, key }) {
    this.type = type;
    this.value = value;
    this.key = key
    this.child = [];
  }
}

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

const parseStr = new ArrayParser(testcase);

console.log(JSON.stringify(parseStr.getArrayParser(), null, 2));