xYourHeart
==========

Simple and readable promises API for JavaScript and Node.js

## Single Promise 

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
    .exec();

## Multiple Synchronous Promises

  var promises = xYourHeart.promises();
  
  promises
    .will(doSomething)
      .success(function(){
        console.log(':-)')
      })
      .failure(function() {
        console.log(':-(');
      })
    .then(function() {
      console.log('do nothing but continue to next step as success');
      this.kept();
      promises.next();
    })
    .then(doSomethingElse, [ 'argument 1', 'argument 2' ])
    .exec();
  
## Multiple Asynchronous Promises

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
    


