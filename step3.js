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
    let count = 0;
    let prevDataSample = this.item.child;
    for (let value of splitStringData) {
      debugger;
      switch (value) {
        case "[":
          count++;
          var childArr = this.getChildArr(prevDataSample, count);
          continue;
        case "]":
          count--;
          continue;
        default:
          var dataSample = new dataSampleClass();
          var pileDataSample = this.inputData(dataSample, value);
      }
      if (count > 0) {
        prevDataSample = this.pileData(pileDataSample, childArr, count);
        continue;
      }
      else this.item.child.push(pileDataSample);
    }
    return this.item.child;
  }

  inputData(dataSample, value) {
    dataSample["type"] = "number";
    dataSample["value"] = value;
    return dataSample
  }

  getChildArr(prevDataSample, count) {
    let pileDataSample = new dataSampleClass();
    pileDataSample.type = "array";
    pileDataSample.value = "ArrayObject";
    if (count > 0) {
      for (let i = 0; i < prevDataSample.length; i++) {
        if (prevDataSample[i]["type"] === "array") this.getChildArr(prevDataSample[i]["child"])
      }
    }
    prevDataSample.push(pileDataSample);
    return pileDataSample.child;
  }

  pileData(pileDataSample, childArr, count) {
    childArr.push(pileDataSample);
    return childArr;
  }
}
//토큰별로 나눈 string의 type과 value를 입력해주는 함수.

class dataSampleClass {
  constructor() {
    this.type = "",
      this.value = "",
      this.child = []
  }
}

const parseStr = new ArrayParser();
// console.log(JSON.stringify(parseStr.splitStringData("[123,[22,23,[11,112],55],33]"), null, 2)); 
console.log(JSON.stringify(parseStr.splitStringData("[123,[22,23,[11,112],55],33]"), null, 2));
// console.log(JSON.stringify(parseStr.splitStringData("[1,[2,5,[3]],4]"), null, 2));
