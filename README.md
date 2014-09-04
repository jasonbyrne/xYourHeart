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

With the plural form "promises" you can create a queue of multiple promises that because executed either linearly (syncrhronously) or all happening at once (async).

You can use the "will" syntax here or the "then" syntax. Then is actually an alias of will, just to make it more readable.

In thise case we must use the exec method to kick off the first step. In synchronous mode, each call to exec or next will execute the next step. Next differs from exec only in that it allows you to pass in an argument to be used when executing the next promise in the queue. Otherwise, without an argument they can be used interchangibly whatever reads better to execute the next step.

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

But if you pass a true value as the argument to exec you are telling xYourHeart to execute all of the remaining calls asynchronously.

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
In this way it is also possible to execute the first step or two linearly and then execute the rest asynchronously.

```javascript
var promise = xYourHeart.promises()

promises
  .will(function() {
    doSomethingWithACallback(function(){
      promises.exec(true);
    })
  }))
  .exec()
  .will(somethingElse)
  .will(someFileSystemCall, [ '/some/file/path.txt' ])
    .failure(function(){
      console.log('handle file failure');
    })
  .finally(function() {
    console.log('Everything is done!');
    console.log(this.countSuccesses() + ' succeeded. ' + this.countFailures() + ' failed.');
  });
```


