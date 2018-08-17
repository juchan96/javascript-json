class ArrayParser {
  constructor() {
    this.item = {
      type: "array",
      child: []
    };
    this.count = 0;
    this.sum = 0;
  }

  ArrayParser(str) {
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
    let tokenizeStr;
    for (let index = 0; index < str.length; index++) {
      !isNaN(str[index]) ? tokenizeStr += str[index]
      : str[index] === "[" ? tokenizeStr += "[" + ","
      : str[index] === "]" ? tokenizeStr += "," + "]"
      : tokenizeStr += ",";
    }
    let result = tokenizeStr.split(",");
    result.shift();
    result.pop();
    console.log(result)
    return result;
  }
  //분석한 숫자 타입 데이터를 파싱하여, 객체로 반환해주는 함수
  getParseData(splitStringData) {
    let result;
    let newNumTypeObj;
    const ArrayParserItem = this.item.child;
    let lastChildArr = ArrayParserItem;

    for (let value of splitStringData) {
      if (!isNaN(value) && value !== "") {
        newNumTypeObj = this.addNewObjThatTypeIsNum(value);
      } else {
        lastChildArr = this.getLastChildArr(lastChildArr, value, ArrayParserItem);
        continue;
      }
      result = this.getArrParserItemResult(ArrayParserItem, newNumTypeObj, lastChildArr)
    }
    return result;
  }
  //val가 숫자일 때, 그 숫자에 대한 데이터(type,value)를 새로운 객체에 입력한다.그리고, 그 객체를 반환한다.
  addNewObjThatTypeIsNum(value) {
    var NewNumTypeObj = new dataSampleClass();
    NewNumTypeObj["type"] = "number";
    NewNumTypeObj["value"] = value;
    return NewNumTypeObj;
  }
  //ArrayParserItem에 필요한 값들을 추가해주는 함수.
  getArrParserItemResult(ArrayParserItem, newNumTypeObj, lastChildArr) {
    if (this.count > 0) {
      lastChildArr.push(newNumTypeObj);
    } else ArrayParserItem.push(newNumTypeObj);

    return ArrayParserItem;
  }

  //val가 "[" 일때 마지막 child배열을, "]"일 때에는 마지막에서 2번째 child배열을 반환해주는 함수.
  getLastChildArr(lastChildArr, value, ArrayParserItem) {
    switch (value) {
      case "[":
        this.count++;
        const newArrType = this.addNewObjThatTypeIsArr();
        lastChildArr.push(newArrType);
        lastChildArr = this.overlapChild(ArrayParserItem);
        break;
      case "]":
        this.count--;
        lastChildArr = this.excapeChild(ArrayParserItem);
        break;
    }
    return lastChildArr;
  }
  //val가 "[" 또는 "]"일 때, 새로운 객체를 생성하여 type(array)과 value(arrayObject)를 입력한다. 그리고, 그 객체를 반환한다.
  addNewObjThatTypeIsArr() {
    let NewArrType = new dataSampleClass();
    NewArrType.type = "array";
    NewArrType.value = "ArrayObject";
    return NewArrType;
  }
  //lastchild를 찾아가는 함수.
  overlapChild(ArrayParserItem) {
    for (let index = 0; index < ArrayParserItem.length; index++) {
      if (ArrayParserItem[index]["type"] === "array") {
        return this.overlapChild(ArrayParserItem[index]["child"]);
      }
    }
    return ArrayParserItem;
  }
  //lastchild의 전 단계(마지막 child에서 2번째 child)를 찾아가는 함수.
  excapeChild(ArrayParserItem) {
    for (let index = 0; index < ArrayParserItem.length; index++) {
      if (ArrayParserItem[index]["type"] === "array" && this.sum !== this.count) {
        this.sum++;
        return this.excapeChild(ArrayParserItem[index]["child"]);
      }
    }
    return ArrayParserItem;
  }
}

// 토큰별로 나눈 string의 type과 value를 입력해주는 함수.
class dataSampleClass {
  constructor() {
    this.type = "",
      this.value = "",
      this.child = []
  }
}

const parseStr = new ArrayParser();
const testcase = "[1,[  2]]"
const testcase1 = "[1,[2,[3,4,[10,12],60],5,6],7]";
const testcase2 = "[[[[[]]]]]"
const testcase3 = "[123,[22,23,[11,112],55],33]"
console.log(JSON.stringify(parseStr.ArrayParser(testcase3), null, 2));
