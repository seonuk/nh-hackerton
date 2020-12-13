# nh-hackerton

얼굴 이미지 비교 api

## api

```json
POST ~/recognition
```


### request body
```json
  {
    "source": "source1.jpeg",
    "target": "target1.jpeg"
  }
```
| name        | description     | madatory |
| ------------- |:-------------:| ------------- |
| `source`      | 인증할 사진 uri | True |
| `target`      | 등록한 유저의 uri | True |


### response body
```json
  {
    "result": true
  }
```

| name        | description     | madatory |
| ------------- |:-------------:| ------------- |
| `result`      | similarity 90% 이상 True, 이하 False | True |
