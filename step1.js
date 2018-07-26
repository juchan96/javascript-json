class ArrayParser {
  constructor() {
    this.item = {
      type: "",
      child: []
    }
  }
  //문자를 쪼개서, 숫자만 따로 배열에 저장해서 반환하는 함수
  splitData(str) {
    let tokenizeStr = "";
    for (let n = 0; n < str.length; n++) {
      if (!isNaN(str[n])) {
        tokenizeStr += str[n];
      } else tokenizeStr += ",";
    }

    let result = tokenizeStr.split(",")
    result.shift();
    result.pop();
    return this.parseData(result);
  }
  //분석한 데이터를 반환해주는 함수
  parseData(splitData) {
    splitData.forEach((element) => {
      const dataSample = new dataSampleClass();
      !isNaN(element) ? dataSample.item.type = "number" : dataSample.item.type = "not a number";
      dataSample.item.value = element;
      this.item.child.push(dataSample.item);
    });
    return this.item;
  }
}

class dataSampleClass {
  constructor() {
    this.item = {
      type: "",
      value: "",
      child: []
    }
  }
}

const parseStr = new ArrayParser();
console.log(parseStr.splitData("[123,22,33]"));