import "reflect-metadata";

function defineMethod(metadataKey: string, target: any, propertyKey: string | symbol) {
    const metadata = Reflect.getMetadata(`mongonation:${metadataKey}`, target);

    if (metadata === undefined) {
        Reflect.defineMetadata(`mongonation:${metadataKey}`, {
            [propertyKey]: target[propertyKey],
        }, target);
    } else {
        Reflect.defineMetadata(`mongonation:${metadataKey}`, {
            ...metadata,
            ...{
                [propertyKey]: target[propertyKey],
            },
        }, target);
    }
}

export function Instance(target: any, propertyKey: string | symbol) {
    return defineMethod("instance", target, propertyKey);
}

export function Static(target: any, propertyKey: string | symbol) {
    return defineMethod("static", target, propertyKey);
}
