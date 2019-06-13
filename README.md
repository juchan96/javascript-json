- javscript로 array형태의 데이터를 parsing하는 기능입니다.

- 저장소 링크: https://github.com/juchanhwang/javascript-json/tree/step7
- 기술 스택: JavaScript

Description

- 중첩 된 배열 형태의 문자열을 토큰 단위로 해석 후, 이를 분석하는 자료구조.
- testcase 작성
  함수의 동작이 예상에 맞게 동작하는지 테스트하는 것. 함수의 기능이 작든 크든 상관없이 테스트케이스를 작성할 수 있다는 것을 알게 됨. 자료구조를 해석하고 다시 분석하며 발생할 수 있는 오류의 경우의 수들도 테스트함. 개발 당시에 오류가 없을 것이라 확신했던 코드에 오류가 없을 가능성이 적고, 오류가 날 상황을 직접 예측하고 대처할 수 있다는 것을, 작은 규모지만 경험할 수 있었음.




## 학습 키워드

- for...of 와 for...in의 차이점

  - `for...in` 루프는 객체의 모든 열거가능한 속성에 대해 반복합니다.

    `for...of` 구문은 **컬렉션** 전용입니다, 모든 객체보다는. `[Symbol.iterator]` 속성이 있는 모든 컬렉션 요소에 대해 이 방식으로 반복합니다.

    for each...in - 비슷한 문이지만, 속성 이름 자체보다는 객체의 속성값을 반복합니다 (사라짐).

     





- ## step1. 요구사항

  - ArrayParser함수를 만든다.
  - 배열안에는 숫자데이터만 존재한다.
  - 배열형태의 문자열을 *token단위로 해석한 후, 이를 분석한 자료구조를 만든다.
  - 정규표현식 사용은 최소한으로 한다.(token의 타입체크에 한해 사용가능)

  ------

  ## 실행결과

  ```
  var str = "[123, 22, 33]";
  var result = ArrayParser(str);
  console.log(JSON.stringify(result, null, 2));   //보기좋게 출력할수도 있음.
  ```

  result의 결과는 해당 배열을 분석한 형태이어야 한다. 예를들어 다음과 같은 결과일 수 있다. (꼭 이와 같은 결과일 필요가 없음)

  ```
  { type: 'array',
    child: 
     [ { type: 'number', value: '123', child: [] },
       { type: 'number', value: '22', child: [] },
       { type: 'number', value: '33', child: [] } 
      ] 
  }
  ```

  ------

  ## 참고 - token의구현

  처음에는, 이런 식으로 동작하는 것부터 구현해보자.

  var str = "[1,2]"; // 문자열 str을 한글자씩 탐색하면서 '[' , ']' 를 출력해보기 (반복문을 사용한다) // 또는 숫자형태의 문자만(1,2) 출력해보기

  이런 과정을 하는 것을 토큰나이저(tokenizer)라고 한다. 하나의 작은 실행단위를 토큰이라고하고, 문자열에서 토큰을 추출해나가는 것이다.



## step2. 요구사항

- 배열안에 배열이 있는 경우도 분석한다.
  - var s = "[123,[22],33]";

- 중첩된 배열 원소도 역시, 숫자데이터만 존재한다. 
- 중첩된 결과는 child 부분에 추가해서 결과가 표현돼야 한다.



## 실행결과

```
var str = var s = "[123,[22],33,[1,2,3,4,5]]";
var result = ArrayParser(str);
console.log(JSON.stringify(result, null, 2));
//배열안의 배열 같은경우, 다음과 같이 표현될 수 있다(예시)
     { type: 'array', value: ArrayObject, child: [{type:'number', value:22, child:[]}] }
```



## step3. 요구사항

- 무한중첩 구조도 동작하게 한다. [[[[[]]]]]
- 배열의 원소에는 숫자타입만 존재한다.
- 복잡한 세부로직은 함수로 분리해본다.
- 중복된 코드역시 함수로 분리해서 일반화한다.
- **프로그래밍 설계를 같이 PR한다.**
- hint : 중첩문제를 풀기 위해 stack구조를 활용해서 구현할 수도 있다. 

## 실행결과

```
var str = "[123,[22,23,[11,[112233],112],55],33]";
var result = ArrayParser(str);
console.log(JSON.stringify(result, null, 2)); 

//중첩된 배열을 분석했음으로, 결과 역시 중첩된 객체형태이다.
```



## step3. 설계

- str = "[1,[2,[3],4],5]"

- 토큰별로 나누는 함수 생성 => 배열안에 다시 담는다 // ["1", "[", "2", "]", "[", "3", "]", "4", "]", "5"]

- 반복문을 통해 각 토큰에 접근 한다.

  1. 만약 숫자이면, 새로운 객체 타입을 만들어 숫자 데이터를 객체 안에 담는다.

     ```
     type: number,
     value: 1,
     child: []
     ```

     - 숫자 데이터가 담긴 데이터를 lastChild안에 담는다.

     ```
     type: array,
     value: arrayObject,
     child: [
         type: number,
     	value: 1,
     	child: []
     ]
     ```

  2. 만약 "["가 나오면, 새로운 객체 타입을 만들어 배열 데이터를 객체 안에 담는다.

     ```
     type: array,
     value: arrayObject,
     child: []
     ```

  3. 재귀를 통해서 lastChild에 접근하고 객체를 lastChild안에 담는다.

     ```
     type: array,
     value: arrayObject,
     child: [
         type: array,
     	value: arrayObject,
     	child: []
     ]
     ```

  4. 만약 "]"가 나오면 재귀를 통해, 끝에서 2번째 lastChild에 접근한다. (1번으로)

     ```
     type: array,
     value: arrayObject,
     child: [
         type: array,
     	value: arrayObject,
     	child: [/*not here*/],
     	// 여기에 접근
     ]
     ```

  5. 반복문을 마치면, this.item.child인 arrayParserItem을 반환한다.

     
