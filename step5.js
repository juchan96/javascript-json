class ArrayParser {
  constructor() {
    this.item = {
      type: "array",
      child: []
    };
    this.lastArrChildStack = [];
  }

  getArrayParser(str) {
    const trimBlank = this.getTrimBlank(str);
    const StringData = this.splitStringData(trimBlank);
    const parseData = this.getParseData(StringData);
    return parseData;
  }
  //필요없는 공백을 잘라내는 함수.
  getTrimBlank(str) {
    const trimStr = str.split(' ').join("")
    console.log(trimStr);
    return trimStr;
  }
  //문자를 쪼개서, 숫자만 따로 배열에 저장해서 반환하는 함수
  splitStringData(str) {
    let tokenizeStr = "";
    for (let value of str) {
      if (value === "[" || value === "{") {
        tokenizeStr += value + ",";
      }
      else if (value === "]" || value === "}") {
        tokenizeStr += "," + value;
      }
      else if (value === ":") {
        tokenizeStr += value + ","
      }
      else if (value !== ":") {
        tokenizeStr += value;
      }
    }
    const result = tokenizeStr.split(",")
    console.log(result);
    return result;
  }
  //여러 타입 데이터를 파싱하여, 어떠한 형태의 데이터로 반환해주는 함수
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
  //this.lastChildArr는 가장 끝에 있는 child배열들을 담은 배열이다.
  //child의 주소값에 접근해서, 값들을 담는 함수
  getLastChildArr(lastChildArr, valOfSplitStrData) {
    let findKeyPattern = /:/;

    if (valOfSplitStrData === "[") {
      const newArrTypeObj = new dataSampleClass({ type: "array", value: "arrayObj" });
      this.getlastArrChildStack(lastChildArr, newArrTypeObj);
    }
    else if (valOfSplitStrData === "{") {
      const newObjTypeObj = new dataSampleClass({ type: "object" });
      this.getlastArrChildStack(lastChildArr, newObjTypeObj);
    }
    else if (valOfSplitStrData === "]" || valOfSplitStrData === "}") {
      this.lastArrChildStack.pop();
    }
    else if (findKeyPattern.test(valOfSplitStrData)) {
      valOfSplitStrData = valOfSplitStrData.replace(findKeyPattern, "")
      const newKeyTypeObj = new dataSampleClass({ type: "string", key: valOfSplitStrData });
      this.getlastArrChildStack(lastChildArr, newKeyTypeObj);
    }
    else {
      const newStrTypeObj = new dataSampleClass({ type: "string", value: valOfSplitStrData });
      lastChildArr.push(newStrTypeObj);
      this.checkError(valOfSplitStrData);
    }

    const lastIdx = this.lastArrChildStack.indexOf([...this.lastArrChildStack].pop())
    lastChildArr = this.lastArrChildStack[lastIdx];
    return lastChildArr;
  }
  //가장 마지막에 있는 child에 접근시켜주는 함수
  getlastArrChildStack(lastChildArr, newTypeObj) {
    lastChildArr.push(newTypeObj);
    const lastIdx = lastChildArr.indexOf([...lastChildArr].pop());
    this.lastArrChildStack.push(lastChildArr[lastIdx]["child"]);
  }
  //여러가지 오류를 체크해주는 함수
  checkError(currentVal) {
    const countQuotes = (currentVal.match(/'/g)).length;
    const unKnownType = currentVal.match(/\d{1}[a-z]{1}/gi);
    try {
      if (countQuotes > 2) throw Error(`${currentVal}는 올바른 문자열이 아닙니다.`);
      else if (unKnownType) throw Error(`${currentVal}는 알 수 없는 타입입니다.`);
    }
    catch (errorMsg) {
      console.log(errorMsg)
    }
  }
}
// 토큰별로 나눈 string의 type과 value를 입력해주는 함수
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
const testcase4 = "[[[[[    ]]]]";
const testcase5 = "[123,[22,23,[11,112],55],33]";
const testcase6 = "['1a3',[null,false,['11',[112233],112],55,99],33, true]";
const testcase7 = "['1'a'3',[null,false,['11',[112233],{easy : ['hello', {a:'a'}, 'world']},112],55, '99'],{a:'str', b:[912,[5656,33],{key : 'innervalue', newkeys: [1,2,3,4,5]}]}, true]";
const testcase8 = "[{a:'b'c'}]";
console.log(JSON.stringify(parseStr.getArrayParser(testcase7), null, 2));