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
    let sum = 0;
    let count = 0;
    let prevDataSample = this.item;
    let noNameData = false;
    for (let value of splitStringData) {
      debugger;
      noNameData = noNameData || prevDataSample.child
      switch (value) {
        case "[":
          count++;
          var childArr = this.getChildArr();
          noNameData.push(childArr);
          noNameData = this.excapePileData(prevDataSample.child);
          continue;
        case "]":
          count--
          noNameData = this.fn(prevDataSample.child, count, sum)
          continue;
        default:
          var inputDat = this.inputData(value);
        // this.item.child.push(inputDat);
      }
      if (count > 0) {
        noNameData.push(inputDat)
        continue;
      } else {
        this.item.child.push(inputDat);
      }
    }
    return this.item.child;
  }

  inputData(value) {
    var dataSample = new dataSampleClass();
    dataSample["type"] = "number";
    dataSample["value"] = value;
    return dataSample
  }

  getChildArr() {
    let inputDat = new dataSampleClass();
    inputDat.type = "array";
    inputDat.value = "ArrayObject";
    return inputDat;
  }

  excapePileData(prevDataSample) {
    for (let index = 0; index < prevDataSample.length; index++) {
      let element = prevDataSample[index];
      if (element["type"] === "array") {
        return this.excapePileData(prevDataSample[index]["child"])
      }
    }
    return prevDataSample;
  }

  fn(prevDataSample, count, sum) {
    for (let i = 0; i < prevDataSample.length; i++) {
      let element = prevDataSample[i];
      if (element["type"] === "array" && sum !== count) {
        sum++;
        return this.fn(prevDataSample[i]["child"], count, sum)
      }
    }
    return prevDataSample;
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
console.log(JSON.stringify(parseStr.splitStringData("[1,[2,[3,4,[10,12],60],5,6],7]"), null, 2));