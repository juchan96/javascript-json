class ArrayParser {
  constructor() {
    this.item = {
      type: "array",
      child: []
    }
  }
  //문자를 쪼개서, 숫자만 따로 배열에 저장해서 반환하는 함수
  splitStringData(str) {
    let tokenizeStr = "";
    for (let n = 0; n < str.length; n++) {
      !isNaN(str[n]) ? tokenizeStr += str[n]
      : str[n] === "[" ? tokenizeStr += str[n] + ","
      : str[n] === "]" ? tokenizeStr += "," + str[n]
      : tokenizeStr += ",";
    }
    let result = tokenizeStr.split(",")
    result.shift();
    result.pop();
    console.log(result)
    return this.parseData(result);
  }
  //분석한 데이터를 반환해주는 함수
  parseData(splitStringData) {
    const sum = 0;
    let count = 0;
    const ArrayParserItem = this.item.child;
    let lastChildArr = ArrayParserItem;
    for (let value of splitStringData) {
      debugger;
      switch (value) {
        case "[":
          count++;
          var newArrTypeObj = this.addNewObjThatTypeIsArr();
          lastChildArr.push(newArrTypeObj);
          lastChildArr = this.overlapChild(ArrayParserItem);
          continue;
        case "]":
          count--;
          lastChildArr = this.excapeChild(ArrayParserItem, count, sum);
          continue;
        default:
          var NewNumTypeObj = this.addNewObjThatTypeIsNum(value);
      }
      if (count > 0) {
        lastChildArr.push(NewNumTypeObj);
        continue;
      } else ArrayParserItem.push(NewNumTypeObj);
    }
    return ArrayParserItem;
  }

  addNewObjThatTypeIsNum(value) {
    var NewNumTypeObj = new dataSampleClass();
    NewNumTypeObj["type"] = "number";
    NewNumTypeObj["value"] = value;
    return NewNumTypeObj;
  }

  addNewObjThatTypeIsArr() {
    let NewArrTypeObj = new dataSampleClass();
    NewArrTypeObj.type = "array";
    NewArrTypeObj.value = "ArrayObject";
    return NewArrTypeObj;
  }

  overlapChild(ArrayParserItem) {
    for (let index = 0; index < ArrayParserItem.length; index++) {
      if (ArrayParserItem[index]["type"] === "array") {
        return this.overlapChild(ArrayParserItem[index]["child"]);
      }
    }
    return ArrayParserItem;
  }

  excapeChild(ArrayParserItem, count, sum) {
    for (let index = 0; index < ArrayParserItem.length; index++) {
      if (ArrayParserItem[index]["type"] === "array" && sum !== count) {
        sum++;
        return this.excapeChild(ArrayParserItem[index]["child"], count, sum);
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
// console.log(JSON.stringify(parseStr.splitStringData("[123,[22,23,[11,112],55],33]"), null, 2)); 
// console.log(JSON.stringify(parseStr.splitStringData("[123,[22,23,[11,112],55],33]"), null, 2));
const testcase1 = "[1,[2,[3,4,[10,12],60],5,6],7]";
const testcase2 = "[[[[[]]]]]"
console.log(JSON.stringify(parseStr.splitStringData(testcase1), null, 2));