const typeChecker = {
  isOpenSquareBracket: (valueOfStr) => valueOfStr === "[" ? true : false,
  isOpenCurlyBracket: (valueOfStr) => valueOfStr === "{" ? true : false,
  isCloseSquareBracket: (valueOfStr) => valueOfStr === "]" ? true : false,
  isCloseCurlyBracket: (valueOfStr) => valueOfStr === "}" ? true : false,
  isCloseBrackets: (valOfSplitStrData) => (typeChecker.isCloseSquareBracket(valOfSplitStrData) || typeChecker.isCloseCurlyBracket(valOfSplitStrData)) ? true : false,
  isColon: (valueOfStr) => valueOfStr === ":" ? true : false,
  isElseStrings: (valueOfStr) => valueOfStr !== ":" ? true : false
}

module.exports = typeChecker;