"use strict";
/**
 * The PlayCreator class declares the factory method that is supposed to return an
 * object of a Product class. The PlayCreator's subclasses usually provide the
 * implementation of this method.
 */
class PlayCreator {
    /**
     * Also note that, despite its name, the PlayCreator's primary responsibility is
     * not creating products. Usually, it contains some core business logic that
     * relies on Product objects, returned by the factory method. Subclasses can
     * indirectly change that business logic by overriding the factory method
     * and returning a different type of product from it.
     */
    somePlayOperation() {
        // Call the factory method to create a Product object.
        const product = this.playFactory();
        // Now, use the product.
        return `PlayCreator: The same PlayCreator's code has just worked with ${product.operation()}`;
    }
}
/**
 * Concrete PlayCreators override the factory method in order to change the
 * resulting product's type.
 */
class ConcretePlayCreator1 extends PlayCreator {
    /**
     * Note that the signature of the method still uses the abstract product
     * type, even though the concrete product is actually returned from the
     * method. This way the PlayCreator can stay independent of concrete product
     * classes.
     */
    playFactory() {
        return new ConcreteProduct1();
    }
}
class ConcretePlaylistCreator2 extends PlayCreator {
    playFactory() {
        return new ConcreteProduct2();
    }
}
/**
 * Concrete Products provide various implementations of the Product interface.
 */
class ConcreteProduct1 {
    operation() {
        return '{Result of the ConcreteProduct1}';
    }
}
class ConcreteProduct2 {
    operation() {
        return '{Result of the ConcreteProduct2}';
    }
}
/**
 * The client code works with an instance of a concrete PlayCreator, albeit through
 * its base interface. As long as the client keeps working with the PlayCreator via
 * the base interface, you can pass it any PlayCreator's subclass.
 */
function clientCode(playCreator) {
    // ...
    console.log('Client: I\'m not aware of the PlayCreator\'s class, but it still works.');
    console.log(playCreator.somePlayOperation());
    // ...
}
/**
 * The Application picks a creator's type depending on the configuration or
 * environment.
 */
console.log('App: Launched with the ConcreteCreator1.');
clientCode(new ConcretePlayCreator1());
console.log('');
console.log('App: Launched with the ConcreteCreator2.');
clientCode(new ConcretePlaylistCreator2());
