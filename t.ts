import {
    type Test,
    TestSchema,
    TestChild1Schema,
    TestChild2Schema,
    TestsSchema,
} from './frontend/src/gen/proto_test/main_pb';
import { create, fromBinary, toBinary } from '@bufbuild/protobuf';
const items: Test[] = [];

function init() {
    for (let i = 0; i < 1000; i++) {
        items.push(
            create(TestSchema, {
                name: i + '',
                description: i + '',
                children: [
                    create(TestChild1Schema, {
                        name: i + '',
                        child: create(TestChild2Schema, {
                            name: i + '',
                        }),
                    }),
                ],
            }),
        );
    }
}

init();

console.log(items.length);
let timeOffset = Date.now();
const jsonStr = JSON.stringify(items);
console.log(
    'JSON stringify:',
    Date.now() - timeOffset,
    jsonStr.length / 1000000,
);
timeOffset = Date.now();
const protoStr = toBinary(
    TestsSchema,
    create(TestsSchema, {
        items,
    }),
);
console.log(
    'Protobuf stringify:',
    Date.now() - timeOffset,
    protoStr.length / 1000000,
);

function json() {
    timeOffset = Date.now();
    const itms = JSON.parse(jsonStr);
    console.log('JSON parse:', Date.now() - timeOffset, itms.length);
}

function proto() {
    timeOffset = Date.now();
    const res = fromBinary(TestsSchema, protoStr);
    console.log('Protobuf parse:', Date.now() - timeOffset, res.items.length);
}

json();
proto();
