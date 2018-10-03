const typeChecker = require('./typeChecker.js');

class StringDataTokenizer {
  constructor(stringData) {
    this.stringData = stringData;
  }

  getTokenizedStrArr() {
    const trimmedData = this.getTrimBlank(this.stringData)
    const tokenizedStrArr = this.splitStringData(trimmedData)
    return tokenizedStrArr;
  }

  getTrimBlank(stringData) {
    return stringData.split(' ').join("");
  }

  splitStringData(str) {
    let strToken = "";

    for (let value of str) {
      if (typeChecker.isOpenSquareBracket(value)) {
        strToken += value + ",";
      } else if (typeChecker.isOpenCurlyBracket(value)) {
        strToken += value + ",";
      } else if (typeChecker.isCloseBrackets(value)) {
        strToken += "," + value;
      } else if (typeChecker.isColon(value)) {
        strToken += value + ","
      } else if (typeChecker.isElseStrings(value)) {
        strToken += value;
      }
    }
    const tokenizedStrArr = strToken.split(",");
    return tokenizedStrArr;
  }
}

module.exports = StringDataTokenizer;