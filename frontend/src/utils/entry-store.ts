import { ref } from 'vue';

export interface EntryStoreQuery<ItemType> {
    (item: ItemType): boolean | number | string | unknown;
}

export interface EntryStoreMethods<ItemType, Methods = unknown> {
    (store: EntryStore<ItemType>): Methods;
}

export class EntryStore<ItemType, Methods = undefined> {
    items = ref<ItemType[]>([]);
    methods: Methods;

    constructor(
        private idKey: keyof ItemType,
        initItems?: ItemType[],
        methods?: (store: EntryStore<ItemType, Methods>) => Methods,
    ) {
        if (methods) {
            this.methods = methods(this);
        } else {
            this.methods = {} as Methods;
        }
        if (initItems) {
            this.items.value = initItems;
        }
    }
    find(query: EntryStoreQuery<ItemType>): ItemType | null {
        for (let i = 0; i < this.items.value.length; i++) {
            const item = this.items.value[i];
            if (query(item as ItemType)) {
                return item as ItemType;
            }
        }
        return null;
    }

    findById(id: unknown): ItemType | null {
        const output = this.items.value.find(
            (e) => e[this.idKey as never] === id,
        );
        return (output as ItemType) || null;
    }

    findMany(query: EntryStoreQuery<ItemType>): ItemType[] {
        const output: ItemType[] = [];
        for (let i = 0; i < this.items.value.length; i++) {
            const item = this.items.value[i];
            if (query(item as ItemType)) {
                output.push(this.items.value[i] as ItemType);
            }
        }
        return output;
    }

    findManyById(ids: unknown[]): ItemType[] {
        return this.items.value.filter((e) =>
            ids.includes(e[this.idKey as never]),
        ) as ItemType[];
    }

    set(inputItems: ItemType | ItemType[]): void {
        const items =
            inputItems instanceof Array ? inputItems : [inputItems];
        for (let i = 0; i < items.length; i++) {
            const inputItem = items[i];
            let found = false;
            for (let j = 0; j < this.items.value.length; j++) {
                const storeItem = this.items.value[j];
                if (
                    storeItem[this.idKey as never] === inputItem[this.idKey]
                ) {
                    found = true;
                    this.items.value.splice(j, 1, inputItem as any);
                    break;
                }
            }
            if (!found) {
                this.items.value.push(inputItem as any);
            }
        }
    }

    remove(inputIds: unknown | unknown[]): void {
        const ids = inputIds instanceof Array ? inputIds : [inputIds];
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            for (let j = 0; j < this.items.value.length; j++) {
                const item = this.items.value[j];
                if (item[this.idKey as never] === id) {
                    this.items.value.splice(j, 1);
                    break;
                }
            }
        }
    }

    clear(): void {
        this.items.value = [];
    }
}
