import "reflect-metadata";

function setProperty(key: string, value: any, target: any, propertyKey: string | symbol) {
    const metadata = Reflect.getMetadata("mongonation:schema", target);
    const property = metadata[propertyKey];
    let newProperty: any;

    if (property === undefined) {
        throw new Error(`${propertyKey} is not a property`);
    }

    if (Array.isArray(property)) {
        newProperty = [{
            ...property[0],
            [key]: value,
        }];
    } else {
        newProperty = {
            ...property,
            [key]: value,
        };
    }

    Reflect.defineMetadata("mongonation:schema", {
        ...metadata,
        [propertyKey]: newProperty,
    }, target);
}

export function Required(validator: () => boolean = () => true) {
    return (target: any, propertyKey: string | symbol) => {
        return setProperty("required", validator, target, propertyKey);
    };
}

export function Unique(target: any, propertyKey: string | symbol) {
    return setProperty("unique", true, target, propertyKey);
}
