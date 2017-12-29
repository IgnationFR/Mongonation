import * as mongoose from "mongoose";
import { Document, model, Schema } from "mongoose";

export function Model<T extends { new(...args: any[]): {} }>(constructor: T) {
    const schema = new Schema(Reflect.getMetadata("mongonation:schema", constructor.prototype));
    const instanceMethods = Reflect.getMetadata("mongonation:instance", constructor.prototype);
    const staticMethods = Reflect.getMetadata("mongonation:static", constructor);
    const preHooks = Reflect.getMetadata("mongonation:pre", constructor.prototype);
    const postHooks = Reflect.getMetadata("mongonation:post", constructor.prototype);

    for (const name in instanceMethods) {
        if (instanceMethods.hasOwnProperty(name)) {
            const instanceMethod = instanceMethods[name];

            schema.method(name, instanceMethod);
        }
    }

    for (const name in staticMethods) {
        if (staticMethods.hasOwnProperty(name)) {
            const staticMethod = staticMethods[name];

            schema.method(name, staticMethod);
        }
    }

    for (const method in preHooks) {
        if (preHooks.hasOwnProperty(method)) {
            const preHook = preHooks[method];

            schema.pre(method, preHook);
        }
    }

    for (const method in postHooks) {
        if (postHooks.hasOwnProperty(method)) {
            const postHook = postHooks[method];

            schema.pre(method, postHook);
        }
    }

    return class extends constructor {
        public static model: mongoose.Model<T & Document> = model((constructor as any).name, schema);
    };
}
