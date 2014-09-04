xYourHeart
==========

Simple and readable promises API for JavaScript and Node.js

## Single Promise 

You can use the "will" method to set up the task to be done in the promise, but not yet execute it. This helps it to have a little more readability and maches with the multi-promise syntax...

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

But it's not required because you can just pass it in with the constructor...

```javascript
var promise = xYourHeart.promise(doSomething).exec();

promise
  .success(function() {
    console.log('it worked!');
  })
  .failure(function(err) {
    console.log('Error: ' + err);
  });

```

Or you don't have to use "will" or "exec" at all...

```javascript
var promise = xYourHeart.promise();

$.post('/api/call', function(err, data) {
  if (err) {
    promise.broken(err);
  }
  else {
    promise.kept(data);
  }
});

promise
  .success(function() {
    console.log('it worked!');
  })
  .failure(function(err) {
    console.log('Error: ' + err);
  });

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


