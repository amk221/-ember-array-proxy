import Controller from '@ember/controller';
import ArrayProxy from '@ember/array/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { action } from '@ember/object';
import { A as emberA } from '@ember/array';
import { Promise, resolve } from 'rsvp';
import { later } from '@ember/runloop';

const PromiseProxyArray = ArrayProxy.extend(PromiseProxyMixin);

export function promiseArray(maybePromise) {
  return PromiseProxyArray.create({
    promise: resolve(maybePromise)
  });
}

export default class ApplicationController extends Controller {
  constructor() {
    super(...arguments);

    const promise = new Promise(resolve => {
      later(() => {
        resolve(emberA(['foo', 'bar']));
      }, 1000);
    });

    this.items = promiseArray(promise);
  }

  @action
  addItem() {
    this.items.addObject('baz');

    console.log(this.items.length);
  }
}
