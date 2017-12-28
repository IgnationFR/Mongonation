import "reflect-metadata";

export type DocumentMiddleware = "init" | "validate" | "save" | "remove";
export type QueryMiddleware = "count" | "find" | "findOne" | "findOneAndRemove" | "findOneAndUpdate" | "update";
export type Middleware = DocumentMiddleware | QueryMiddleware;

export function Pre(method: Middleware) {
    return (target: any, propertyKey: string | symbol) => {
        return defineHook("pre", method, target, propertyKey);
    };
}

export function Post(method: Middleware) {
    return (target: any, propertyKey: string | symbol) => {
        return defineHook("post", method, target, propertyKey);
    };
}

function defineHook(metadataKey: string, method: Middleware, target: any, propertyKey: string | symbol) {
    const metadata = Reflect.getMetadata(`mongonation:${metadataKey}`, target);

    if (metadata === undefined) {
        Reflect.defineMetadata(`mongonation:${metadataKey}`, {
            [method]: target[propertyKey],
        }, target);
    } else {
        Reflect.defineMetadata(`mongonation:${metadataKey}`, {
            ...metadata,
            ...{
                [method]: target[propertyKey],
            },
        }, target);
    }
}
