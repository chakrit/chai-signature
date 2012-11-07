
# CHAI-SIGNATURE

chai-signature is a [Chai.js](http://chaijs.com/) assertion library extension for asserting function
type signature tests.

If you find yourself doing a lot of these these kind of tests:

    var self = this;

    expect(function() {
      self.myFunction(null);
    }).to.throw(/ArgumentError/)

Then you will chai-signature must more straightforward:

    expect(this.myFunction).boundTo(this).calledWith(null).to.throw

## API:

All functions expect the subject to be a function.

#### **`.boundTo( [obj] )`**

Binds the source function to `obj`.

#### **`.calledWith( [arg [, arg [, arg... ]]] )`**

Converts the subject (which is a function) into a function call of the subject
with the arguments pre-applied.

