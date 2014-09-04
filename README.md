xYourHeart
==========

Simple and readable promises API for JavaScript and Node.js

## Single Promise 

```javascript
xYourHeart.promise()
  .will(
    function() {
      var promise = this;
      $.get('/api/get/something', function(err, data) {
        if (err) {
          promise.kept(data);
        }
        else {
          promise.broken(err);
        }
      });
    }
  )
  .success(function(data){
    console.log('Got an array back with ' + data.length + ' values. :-)');
  })
  .failure(function(err) {
    console.log('We got this error: ' . err.toString() + ' :-(');
  })
  .exec();
```

## Multiple Synchronous Promises

```javascript
var promises = xYourHeart.promises();

promises
  .will(doSomething)
  .then(function() {
    console.log('do nothing but continue to next step as success');
    this.kept();
    promises.next();
  })
  .then(doSomethingElse, [ 'argument 1', 'argument 2' ])
  .exec();
```

## Multiple Asynchronous Promises

```javascript
xYourHeart.promises()
  .will(someApiCall)
  .will(someFileSystemCall, [ '/some/file/path.txt' ])
    .failure(function(){
      console.log('handle file failure');
    })
  .exec(true)
  .finally(function() {
    console.log('Everything is done!');
    console.log(this.countSuccesses() + ' succeeded. ' + this.countFailures() + ' failed.');
  });
```


