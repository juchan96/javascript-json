const typeChecker = require('./typeChecker.js');

class TokenErrorChecker {
  constructor(tokenizeString) {
    this.numSquareBracket = 0;
    this.numCurlyBracket = 0;
    this.stringData = tokenizeString;
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
      if (typeChecker.isOpenSquareBracket(element)) this.numSquareBracket++;
      else if (typeChecker.isCloseSquareBracket(element)) this.numSquareBracket--;
      else if (typeChecker.isOpenCurlyBracket(element)) this.numCurlyBracket++;
      else if (typeChecker.isCloseCurlyBracket(element)) this.numCurlyBracket--;
    });
  }

  throwBracketErrorMsg() {
    if (this.numSquareBracket !== 0) {
      throw `정상적으로 종료되지 않은 배열이 있습니다.`;
    } else if (this.numCurlyBracket !== 0) {
      throw `정상적으로 종료되지 않은 객체가 있습니다.`;
    }
  }

  getColonError(stringData) {
    stringData.forEach((element, index) => {
      const nextIndex = index + 1;
      if (typeChecker.isOpenCurlyBracket(element)) this.getColonErrorMsg(stringData, nextIndex);
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
      throw `':'이 누락된 객체표현이 있습니다.`;
    }
  }

  getErrorMsgThatNeedVal(stringData, nextIndex) {
    if (!stringData[nextIndex]) {
      throw `value 값이 누락되었습니다.`;
    }
  }
}

module.exports = TokenErrorChecker;