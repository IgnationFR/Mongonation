import { Schema } from "mongoose";
import "reflect-metadata";
import { isPrimitive } from "util";

function defineProperty(metadataValue: any, target: any, propertyKey: string | symbol) {
    const metadataKey = "mongonation:schema";
    const metadata = Reflect.getMetadata(metadataKey, target);

    if (metadata === undefined) {
        Reflect.defineMetadata(metadataKey, {
            [propertyKey]: metadataValue,
        }, target);
    } else {
        Reflect.defineMetadata(metadataKey, {
            ...metadata,
            [propertyKey]: metadataValue,
        }, target);
    }
}

export function Property(target: any, propertyKey: string | symbol) {
    let type = Reflect.getMetadata("design:type", target, propertyKey);

    if (isPrimitive(type) === false) {
        type = {
            ref: type.name,
            type: Schema.Types.ObjectId,
        };
    } else {
        type = { type };
    }

    return defineProperty(type, target, propertyKey);
}

export function Array(typename: string) {
    return (target: any, propertyKey: string | symbol) => {
        let type = Reflect.getMetadata("design:type", target, propertyKey);

        if (type === Array) {
            if (isPrimitive(typename)) {
                type = [{
                    type: typename,
                }];
            } else {
                type = [{
                    ref: typename,
                    type: Schema.Types.ObjectId,
                }];
            }
        } else {
            throw new Error(`${propertyKey} is not an Array. Please use @Property instead`);
        }

        return defineProperty(type, target, propertyKey);
    };
}
