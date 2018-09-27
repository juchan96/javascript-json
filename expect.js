
class Expect {
  constructor(answer) {
    this.answer = answer;
  }

  isEqual(result) {
    let returnMsg;
    if(this.answer === result) returnMsg = `PASS`;
    else returnMsg = `FAIL(targetValue is ${result})`
    return returnMsg;
  }
}

module.exports = Expect;