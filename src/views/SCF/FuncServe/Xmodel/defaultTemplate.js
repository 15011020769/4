export const defaultTemplate = [
  {
    name: 'Hello World事件模板',
    code: `{
      "key1": "test value 1",
      "key2": "test value 2"
    }`
  },
  {
    name: 'COS 对象存储的 POST 事件模板',
    code: `{
      "Records": [
      {
          "cos": {
              "cosSchemaVersion": "1.0",
              "cosObject": {
                  "url": "http://testpic-1253970026.cos.ap-chengdu.myqcloud.com/testfile",
                  "meta": {
                      "x-cos-request-id": "NWMxOWY4MGFfMjViMjU4NjRfMTUyMV8yNzhhZjM=",
                      "Content-Type": ""
                  },
                  "vid": "",
                  "key": "/1253970026/testpic/testfile",
                  "size": 1029
              },
              "cosBucket": {
                  "region": "cd",
                  "name": "testpic",
                  "appid": "1253970026"
              },
              "cosNotificationId": "unkown"
          },
          "event": {
              "eventName": "cos: ObjectCreated:Post",
              "eventVersion": "1.0",
              "eventTime": 1545205770,
              "eventSource": "qcs::cos",
              "requestParameters": {
                  "requestSourceIP": "192.168.15.101",
                  "requestHeaders": {
                      "Authorization": "q-sign-algorithm=sha1&q-ak=AKIDQm6iUh2NJ6jL41tVUis9KpY5Rgv49zyC&q-sign-time=1545205709;1545215769&q-key-time=1545205709;1545215769&q-header-list=host;x-cos-storage-class&q-url-param-list=&q-signature=098ac7dfe9cf21116f946c4b4c29001c2b449b14"
                  }
              },
              "eventQueue": "qcs:0:lambda:cd:appid/1253970026:default.printevent.$LATEST",
              "reservedInfo": "",
              "reqid": 179398952
          }
      }]
    }`
  },
  {
    name: 'COS 对象存储的 PUT 事件模板',
    code: `{
      "Records": [
      {
          "cos": {
              "cosSchemaVersion": "1.0",
              "cosObject": {
                  "url": "http://testpic-1253970026.cos.ap-chengdu.myqcloud.com/testfile",
                  "meta": {
                      "x-cos-request-id": "NWMxOWY4MGFfMjViMjU4NjRfMTUyMV8yNzhhZjM=",
                      "Content-Type": ""
                  },
                  "vid": "",
                  "key": "/1253970026/testpic/testfile",
                  "size": 1029
              },
              "cosBucket": {
                  "region": "cd",
                  "name": "testpic",
                  "appid": "1253970026"
              },
              "cosNotificationId": "unkown"
          },
          "event": {
              "eventName": "cos: ObjectCreated:Put",
              "eventVersion": "1.0",
              "eventTime": 1545205770,
              "eventSource": "qcs::cos",
              "requestParameters": {
                  "requestSourceIP": "192.168.15.101",
                  "requestHeaders": {
                      "Authorization": "q-sign-algorithm=sha1&q-ak=AKIDQm6iUh2NJ6jL41tVUis9KpY5Rgv49zyC&q-sign-time=1545205709;1545215769&q-key-time=1545205709;1545215769&q-header-list=host;x-cos-storage-class&q-url-param-list=&q-signature=098ac7dfe9cf21116f946c4b4c29001c2b449b14"
                  }
              },
              "eventQueue": "qcs:0:lambda:cd:appid/1253970026:default.printevent.$LATEST",
              "reservedInfo": "",
              "reqid": 179398952
          }
      }]
    }`
  },
  {
    name: 'COS 对象存储的 DELETE 事件模板',
    code: `{
      "Records": [
      {
          "cos": {
              "cosSchemaVersion": "1.0",
              "cosObject": {
                  "url": "http://testpic-1253970026.cos.ap-chengdu.myqcloud.com/testfile",
                  "meta": {
                      "x-cos-request-id": "NWMxOWY4MGFfMjViMjU4NjRfMTUyMV8yNzhhZjM=",
                      "Content-Type": ""
                  },
                  "vid": "",
                  "key": "/1253970026/testpic/testfile",
                  "size": 1029
              },
              "cosBucket": {
                  "region": "cd",
                  "name": "testpic",
                  "appid": "1253970026"
              },
              "cosNotificationId": "unkown"
          },
          "event": {
              "eventName": "cos: ObjectRemove:Delete",
              "eventVersion": "1.0",
              "eventTime": 1545205770,
              "eventSource": "qcs::cos",
              "requestParameters": {
                  "requestSourceIP": "192.168.15.101",
                  "requestHeaders": {
                      "Authorization": "q-sign-algorithm=sha1&q-ak=AKIDQm6iUh2NJ6jL41tVUis9KpY5Rgv49zyC&q-sign-time=1545205709;1545215769&q-key-time=1545205709;1545215769&q-header-list=host;x-cos-storage-class&q-url-param-list=&q-signature=098ac7dfe9cf21116f946c4b4c29001c2b449b14"
                  }
              },
              "eventQueue": "qcs:0:lambda:cd:appid/1253970026:default.printevent.$LATEST",
              "reservedInfo": "",
              "reqid": 179398952
          }
      }]
    }`
  },
  {
    name: 'Api Gateway 事件模板',
    code: `{
      "requestContext": {
        "serviceId": "service-f94sy04v",
        "path": "/test/{path}",
        "httpMethod": "POST",
        "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
        "identity": {
          "secretId": "abdcdxxxxxxxsdfs"
        },
        "sourceIp": "10.0.2.14",
        "stage": "release"
      },
      "headers": {
        "Accept-Language": "en-US,en,cn",
        "Accept": "text/html,application/xml,application/json",
        "Host": "service-3ei3tii4-251000691.ap-guangzhou.apigateway.myqloud.com",
        "User-Agent": "User Agent String"
      },
      "body": "{\\"test\\":\\"body\\"}",
      "pathParameters": {
        "path": "value"
      },
      "queryStringParameters": {
        "foo": "bar"
      },
      "headerParameters":{
        "Refer": "10.0.2.14"
      },
      "stageVariables": {
        "stage": "release"
      },
      "path": "/test/value",
      "queryString": {
        "foo" : "bar",
        "bob" : "alice"
      },
      "httpMethod": "POST"
    }`
  },
  {
    name: 'Ckafka 事件模板',
    code: `{
      "Records": [
        {
          "Ckafka": {
            "topic": "test-topic",
            "partition":"",
            "offset":123456,
            "msgKey": "asdfwasdfw",
            "msgBody": "Hello from Ckafka!"
          }
        }
      ]
    }`
  },
  {
    name: 'Timer 定时触发器事件模板',
    code: `{
      "Type":"Timer",
      "TriggerName":"EveryDay",
      "Time":"2019-02-21T11:49:00Z",
      "Message":"user define msg body"
  }`
  },
]

