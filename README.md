# javascript-json



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

 