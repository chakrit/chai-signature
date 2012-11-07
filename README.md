
# CHAI-SIGNATURE

chai-signature is a [Chai.js](http://chaijs.com/) assertion library extension
to make function precondition testing much easier.

If you find yourself doing a lot of these these kind of tests:

    var self = this;

    expect(function() {
      self.method(null);
    }).to.throw(/ArgumentError/)

With chai-signature it's much shorter and more straightforward:

    expect(this.method).bind(this).calledWith(null).to.throw();

Or the more generally-used shorter version with functions already bound:

    expect(this.method).called(null).to.throw();

## API:

All functions expect the `expect` object to be a function.

#### **`.bind( [obj] )`**
#### **`.bindTo( [obj] )`**
#### **`.boundTo( [obj] )`**

Binds the source function to `obj`.

#### **`.called( [arg [, arg [, arg... ]]] )`**
#### **`.calledWith( [arg [, arg [, arg... ]]] )`**

Converts the subject (which is a function) into a function call of the subject
with the arguments pre-applied.

