export interface ObjectPropSchemaArrayChild {
    __type?: 'string' | 'number' | 'boolean' | 'object' | 'function';
    __content?: ObjectSchema;
}

export type ObjectPropSchemaValidateType =
    | string
    | string[]
    | number
    | number[]
    | boolean
    | boolean[];

export interface ObjectPropSchema {
    __type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function';
    __required: boolean;
    __name?: string;

    __validate?<T>(value: T | ObjectPropSchemaValidateType): boolean;

    __child?: ObjectPropSchemaArrayChild | ObjectSchema;
}

export interface ObjectSchema {
    [key: string]: ObjectPropSchema;
}

export type ObjecUtilityErrorCode =
    | 'e1'
    | 'e2'
    | 'e3'
    | 'e4'
    | 'e5'
    | 'e6'
    | 'e7'
    | 'e8';

export class ObjectUtilityError {
    constructor(
        public errorCode: string,
        public message: string,
    ) {}
}

export class ObjectUtility {
    static compareWithSchema(
        object: any,
        schema: ObjectSchema,
        level?: string,
    ): void | ObjectUtilityError {
        if (typeof level === 'undefined') {
            level = 'root';
        }
        if (typeof object === 'undefined') {
            return new ObjectUtilityError(
                'e1',
                `${level}: 'object' cannot be 'undefined'`,
            );
        }
        if (typeof schema === 'undefined') {
            return new ObjectUtilityError(
                'e2',
                `${level}: 'schema' cannot be 'undefined'`,
            );
        }

        const schemaKeys = Object.keys(schema);
        for (let i = 0; i < schemaKeys.length; i++) {
            const schemaKey = schemaKeys[i];
            if (typeof object[schemaKey] === 'undefined') {
                if (schema[schemaKey].__required) {
                    return new ObjectUtilityError(
                        'e3',
                        `${level}: Object is missing property '${schemaKey}'.`,
                    );
                }
            } else {
                if (object[schemaKey] instanceof Array) {
                    if (schema[schemaKey].__type === 'array') {
                        if (!schema[schemaKey].__child) {
                            return new ObjectUtilityError(
                                'e4',
                                `${level}: Schema property has type of array but` +
                                    ` "__chile" property was not specified.`,
                            );
                        }
                        const childSchema = schema[schemaKey]
                            .__child as ObjectPropSchemaArrayChild;
                        if (object[schemaKey].length > 0) {
                            if (typeof object[schemaKey][0] === 'object') {
                                if (childSchema.__type !== 'object') {
                                    return new ObjectUtilityError(
                                        'e5',
                                        `${level}: Type mismatch at '${schemaKey}'.` +
                                            ` Expected '${childSchema.__type}' but got 'object'.`,
                                    );
                                }
                                for (
                                    let j = 0;
                                    j < object[schemaKey].length;
                                    j++
                                ) {
                                    const result =
                                        ObjectUtility.compareWithSchema(
                                            object[schemaKey][j],
                                            childSchema.__content as ObjectSchema,
                                            level + `.${schemaKey}`,
                                        );
                                    if (result instanceof ObjectUtilityError) {
                                        return result;
                                    }
                                }
                            } else {
                                for (
                                    let j = 0;
                                    j < object[schemaKey].length;
                                    j++
                                ) {
                                    const item = object[schemaKey][j];
                                    if (typeof item !== childSchema.__type) {
                                        return new ObjectUtilityError(
                                            'e6',
                                            `${level}.${schemaKey}[${j}]: Type mismatch found in an` +
                                                ` array '${schemaKey}'. Expected '${
                                                    childSchema.__type
                                                }' but got a '${typeof item}'.`,
                                        );
                                    }
                                }
                            }
                        }
                    } else {
                        return new ObjectUtilityError(
                            'e7',
                            `${level}: Type mismatch of property '${schemaKey}'.` +
                                ` Expected 'object.array' but got '${typeof object[
                                    schemaKey
                                ]}'.`,
                        );
                    }
                } else {
                    if (typeof object[schemaKey] !== schema[schemaKey].__type) {
                        return new ObjectUtilityError(
                            'e8',
                            `${level}: Type mismatch of property '${schemaKey}'. Expected '${
                                schema[schemaKey].__type
                            }' but got '${typeof object[schemaKey]}'.`,
                        );
                    }
                    if (schema[schemaKey].__type === 'object') {
                        const result = ObjectUtility.compareWithSchema(
                            object[schemaKey],
                            schema[schemaKey].__child as ObjectSchema,
                            level + `.${schemaKey}`,
                        );
                        if (result instanceof ObjectUtilityError) {
                            return result;
                        }
                    }
                }
            }
        }
    }

    /**
     * Use only on small not very deep objects without many loops
     */
    static compareObjects(obj1: unknown, obj2: unknown): boolean {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    static deepEqual(
        a: any,
        b: any,
        level: string,
    ): [areEqueal: boolean, errorReson: string | undefined] {
        if (a === b) {
            return [true, undefined];
        }
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) {
            return [false, `${level} -> Length of keys are not equal`];
        }
        for (let i = 0; i < aKeys.length; i++) {
            const key = aKeys[i];
            const aValue = a[key];
            const bValue = b[key];
            if (typeof aValue !== typeof bValue) {
                return [
                    false,
                    `${level} -> ${key} values are not of same type: a;${typeof aValue} !== b;${typeof bValue}`,
                ];
            }
            if (typeof aValue === 'object') {
                if (aValue instanceof Array) {
                    if (!(bValue instanceof Array)) {
                        return [false, `${level} -> ${key} is not an array`];
                    }
                    if (aValue.length !== bValue.length) {
                        return [
                            false,
                            `${level} -> ${key} array length are not equal`,
                        ];
                    }
                    for (let j = 0; j < aValue.length; j++) {
                        const aItem = aValue[j];
                        const bItem = bValue[j];
                        const [ok, err] = ObjectUtility.deepEqual(
                            aItem,
                            bItem,
                            `${level}.${key}.${j}`,
                        );
                        if (!ok) {
                            return [false, err];
                        }
                    }
                } else {
                    const [ok, err] = ObjectUtility.deepEqual(
                        aValue,
                        bValue,
                        `${level}.${key}`,
                    );
                    if (!ok) {
                        return [false, err];
                    }
                }
            } else if (aValue !== bValue) {
                return [false, `${level} -> ${key} are not equal`];
            }
        }
        return [true, undefined];
    }
}
