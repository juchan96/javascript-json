class ArrayParser {
  constructor() {
    this.item = {
      type: "array",
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
    let isTrue = true;
    let count = 0;
    for (let n = 0; n < splitData.length; n++) {
      const dataSample = new dataSampleClass();
      if (splitData[n] === "") {
        count++;
        count % 2 === 1 ? isTrue = false : isTrue = true;
        continue;
      }
      else if (value !== "") {
        !isNaN(value) ? dataSample.item.type = "number" : dataSample.item.type = "not a number";
        dataSample.item.value = value;
      }
      if (!isTrue) {
        const dataSample1 = new dataSampleClass();
        dataSample1.item.type = "array";
        dataSample1.item.value = "ArrayObject";
        dataSample1.item.child.push(dataSample.item);
        this.item.child.push(dataSample1.item);
      } else this.item.child.push(dataSample.item);
    }
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
console.log(parseStr.splitData("[123,[22],33]"));
// console.log(parseStr.splitData("[123,[22],33,[1,2,3,4,5]]"));
