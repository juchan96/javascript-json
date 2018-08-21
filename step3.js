class arrayParser {
  constructor() {
    this.item = {
      type: "array",
      child: []
    };
    this.count = 0;
    this.sum = 0;
  }

  getArrayParser(str) {
    const trimBlank = this.getTrimBlank(str);
    const StringData = this.splitStringData(trimBlank);
    const parseData = this.getParseData(StringData);
    return parseData;
  }
  //필요없는 공백을 잘라내는 함수.
  getTrimBlank(str) {
    const trimStr = str.split(' ').join("");
    return trimStr;
  }
  //문자를 쪼개서, 숫자만 따로 배열에 저장해서 반환하는 함수
  splitStringData(str) {
    let tokenizeStr = "";
    for (let value of str) {
      value === "[" ? tokenizeStr += "[" + ","
      : value === "]" ? tokenizeStr += "," + "]"
      : tokenizeStr += value
    }
    const result = tokenizeStr.split(",");
    console.log(result)
    return result;
  }
  //분석한 숫자 타입 데이터를 파싱하여, 객체로 반환해주는 함수
  getParseData(splitStringData) {
    let result;
    let newNumTypeObj;
    const arrayParserItem = this.item.child;
    let lastChildArr = arrayParserItem;

    for (let value of splitStringData) {
      if (!isNaN(value)) {
        newNumTypeObj = this.addNewObjThatTypeIsNum(value);
      } else {
        lastChildArr = this.getLastChildArr(lastChildArr, value, arrayParserItem);
        continue;
      }
      result = this.getArrParserItemResult(arrayParserItem, newNumTypeObj, lastChildArr)
    }
    return result;
  }
  //val가 숫자일 때, 그 숫자에 대한 데이터(type,value)를 새로운 객체에 입력한다.그리고, 그 객체를 반환한다.
  addNewObjThatTypeIsNum(value) {
    const newNumTypeObj = new dataSampleClass("number", value);
    return newNumTypeObj;
  }
  //lastChild에 값을 추가해준다.
  getArrParserItemResult(arrayParserItem, newNumTypeObj, lastChildArr) {
    if (newNumTypeObj["value"] !== "") lastChildArr.push(newNumTypeObj);
    return arrayParserItem;
  }

  //val가 "[" 일때 마지막 child배열을, "]"일 때에는 마지막에서 2번째 child배열을 반환해주는 함수.
  getLastChildArr(lastChildArr, value, arrayParserItem) {
    switch (value) {
      case "[":
        this.count++;
        const newArrType = this.addNewObjThatTypeIsArr();
        lastChildArr.push(newArrType);
        lastChildArr = this.findLastChild(arrayParserItem);
        break;
      case "]":
        this.sum = 0;
        this.count--;
        lastChildArr = this.findSecondLastChild(arrayParserItem);
        break;
    }
    return lastChildArr;
  }
  //val가 "[" 또는 "]"일 때, 새로운 객체를 생성하여 type(array)과 value(arrayObject)를 입력한다. 그리고, 그 객체를 반환한다.
  addNewObjThatTypeIsArr() {
    const newArrType = new dataSampleClass("array", "arrayObject");
    return newArrType;
  }
  //lastchild를 찾아가는 함수.
  findLastChild(arrayParserItem) {
    for (let value of arrayParserItem) {
      if (value["type"] === "array") {
        return this.findLastChild(value["child"]);
      }
    }
    return arrayParserItem;
  }
  //lastchild의 전 단계(마지막 child에서 2번째 child)를 찾아가는 함수.
  findSecondLastChild(arrayParserItem) {
    for (let value of arrayParserItem) {
      if (value["type"] === "array" && this.sum !== this.count) {
        this.sum++;
        return this.findSecondLastChild(value["child"]);
      }
    }
    return arrayParserItem;
  }
}

// 토큰별로 나눈 string의 type과 value를 입력해주는 함수.
class dataSampleClass {
  constructor(type, value) {
    this.type = type,
      this.value = value
    this.child = []
  }
}

const parseStr = new arrayParser();
const testcase = "[1,[2,[3],4],5]";
const testcase1 = "[1,[         2]]";
const testcase2 = "[1,[2,[[3,4,[10,12],60],9]],7,8]";
const testcase3 = "[[[[[],[]]]]]";
const testcase4 = "[123,[22,23,[11,112],55],33]";
console.log(JSON.stringify(parseStr.getArrayParser(testcase1), null, 2));

