import {
    computed,
    defineComponent,
    onBeforeUnmount,
    onMounted,
    type PropType,
    ref,
    Teleport,
} from 'vue';
import type { JSX } from 'vue/jsx-runtime';
import clsx from 'clsx';
import { InputProps, InputWrapper } from '@root/components/inputs/_wrapper';
import { createId } from '@paralleldrive/cuid2';
import {
    callAndClearUnsubscribeFns,
    type UnsubscribeFns,
} from '@root/utils/sub';
import SearchIcon from '@icons/feather/search.svg?component';
import ChevronLeftIcon from '@icons/feather/chevron-left.svg?component';

export interface SelectOption {
    label: string;
    value: string;
    slot?(data: Omit<SelectOption, 'slot'>): JSX.Element;
    class?: string;
    disabled?: boolean;
    selectedPlaceholder?: string;
}

export type SelectInputSizes = 'xl' | 'md' | '2xl';

export const Select = defineComponent({
    props: {
        ...InputProps,
        placeholder: String,
        disabled: Boolean,
        selected: {
            type: String,
            default: '',
        },
        options: {
            type: Array as PropType<SelectOption[]>,
            required: true,
        },
        size: {
            type: String as PropType<SelectInputSizes>,
            default: 'md',
        },
        searchable: Boolean,
        fixed: Boolean,
    },
    emits: {
        change: (_option?: SelectOption, _triggeredByEntrySync?: boolean) => {
            return true;
        },
    },
    setup(props, ctx) {
        const opened = ref(false);
        const searchTerm = ref('');
        const searchTermAllSelected = ref(false);
        const selectedOption = computed(() =>
            props.options.find((e) => e.value === props.selected),
        );
        const filteredOptions = computed(() => {
            if (props.searchable) {
                return props.options.filter(
                    (option) =>
                        option.label.toLowerCase().includes(searchTerm.value) ||
                        option.value.toLowerCase().includes(searchTerm.value),
                );
            }
            return props.options;
        });
        const inputRef = ref<HTMLButtonElement>();
        const dropdownId = createId();
        const dropdownPosition = ref({
            top: 0,
            left: 0,
            width: 100,
            visible: false,
        });
        const highlightOptionIdx = ref(-1);
        const unsubs: UnsubscribeFns = [];

        function onKeyDown(event: KeyboardEvent) {
            if (!opened.value) return;

            if (isSelectAll(event)) {
                toggleSelectAll(event);
            } else if (isCharacterInput(event)) {
                handleCharacterInput(event);
            } else {
                handleSpecialKeys(event);
            }
        }

        function isSelectAll(event: KeyboardEvent) {
            return event.metaKey && event.key === 'a';
        }

        function toggleSelectAll(event: KeyboardEvent) {
            event.preventDefault();
            searchTermAllSelected.value = !searchTermAllSelected.value;
        }

        function isCharacterInput(event: KeyboardEvent) {
            const charCode = event.key.toLowerCase().charCodeAt(0);
            return (
                props.searchable &&
                event.key.length === 1 &&
                ((charCode >= 48 && charCode <= 57) || // numbers
                    (charCode >= 97 && charCode <= 122) || // letters
                    charCode === 32) // space
            );
        }

        function handleCharacterInput(event: KeyboardEvent) {
            event.preventDefault();
            if (searchTermAllSelected.value) {
                searchTerm.value = event.key[0].toLowerCase();
                searchTermAllSelected.value = false;
            } else {
                searchTerm.value += event.key[0].toLowerCase();
            }
            highlightOptionIdx.value = -1;
        }

        function handleSpecialKeys(event: KeyboardEvent) {
            switch (event.key) {
                case 'Backspace':
                    handleBackspace();
                    break;
                case 'ArrowUp':
                    navigateOptions(-1);
                    break;
                case 'ArrowDown':
                    navigateOptions(1);
                    break;
                case 'Escape':
                    closeDropdown();
                    break;
                case 'Enter':
                    selectOption();
                    break;
                default:
                    handleCharacterInput(event);
                    break;
            }
            scrollToHighlightedOption();
        }

        function handleBackspace() {
            if (searchTerm.value.length > 0) {
                if (searchTermAllSelected.value) {
                    searchTerm.value = '';
                } else {
                    searchTerm.value = searchTerm.value.slice(0, -1);
                }
                highlightOptionIdx.value = -1;
            }
        }

        function navigateOptions(direction: number) {
            const optionsLength = filteredOptions.value.length;
            let newIndex = highlightOptionIdx.value + direction;

            // Loop to find the next non-disabled option
            while (
                newIndex >= 0 &&
                newIndex < optionsLength &&
                filteredOptions.value[newIndex]?.disabled
            ) {
                newIndex += direction;
            }

            // Handle wrapping around
            if (newIndex < 0) {
                // Go to the last selectable option if wrapping upwards
                newIndex = optionsLength - 1;
                while (
                    newIndex >= 0 &&
                    filteredOptions.value[newIndex]?.disabled
                ) {
                    newIndex--;
                }
            } else if (newIndex >= optionsLength) {
                // Go to the first selectable option if wrapping downwards
                newIndex = 0;
                while (
                    newIndex < optionsLength &&
                    filteredOptions.value[newIndex]?.disabled
                ) {
                    newIndex++;
                }
            }

            highlightOptionIdx.value = newIndex;
        }

        const displayText = computed(() => {
            if (opened.value) {
                if (searchTerm.value) {
                    return searchTerm.value;
                } else {
                    if (selectedOption.value) {
                        if (selectedOption.value.selectedPlaceholder) {
                            return selectedOption.value.selectedPlaceholder;
                        } else if (selectedOption.value.slot) {
                            return selectedOption.value.slot(
                                selectedOption.value,
                            );
                        } else {
                            return props.placeholder;
                        }
                    } else {
                        return props.placeholder;
                    }
                }
            } else {
                if (selectedOption.value) {
                    if (selectedOption.value.selectedPlaceholder) {
                        return selectedOption.value.selectedPlaceholder;
                    } else if (selectedOption.value.slot) {
                        return selectedOption.value.slot(selectedOption.value);
                    } else {
                        return selectedOption.value.label;
                    }
                } else {
                    return props.placeholder;
                }
            }
        });

        function closeDropdown() {
            opened.value = false;
            searchTerm.value = '';
            dropdownPosition.value.visible = false;
        }

        function scrollToHighlightedOption() {
            const el = document.getElementById(
                `select_item_${highlightOptionIdx.value}`,
            );
            if (el) el.scrollIntoView();
        }

        function calcDropdownPosition() {
            if (inputRef.value) {
                const inputEl = inputRef.value;
                const bBox = inputEl.getBoundingClientRect();
                if (props.fixed) {
                    dropdownPosition.value.top = bBox.y + bBox.height;
                } else {
                    dropdownPosition.value.top =
                        bBox.y + document.body.scrollTop + bBox.height;
                }
                dropdownPosition.value.left = bBox.x;
                dropdownPosition.value.width = bBox.width;
                setTimeout(() => {
                    const dropdownEl = document.getElementById(dropdownId);
                    if (dropdownEl) {
                        if (
                            bBox.y + dropdownEl.offsetHeight + bBox.height >
                            window.innerHeight
                        ) {
                            dropdownPosition.value.top =
                                bBox.y +
                                document.body.scrollTop -
                                dropdownEl.offsetHeight;
                        }
                    }
                    dropdownPosition.value.visible = true;
                }, 20);
            }
        }

        function selectOption() {
            if (highlightOptionIdx.value !== -1) {
                const option = filteredOptions.value[highlightOptionIdx.value];
                if (option) {
                    ctx.emit('change', option);
                    searchTerm.value = '';
                }
            }
        }

        onMounted(() => {
            window.addEventListener('keydown', onKeyDown);
        });

        onBeforeUnmount(() => {
            callAndClearUnsubscribeFns(unsubs);
            window.removeEventListener('keydown', onKeyDown);
        });

        return () => (
            <InputWrapper
                id={props.id}
                style={props.style}
                class={props.class}
                error={props.error}
                label={props.label}
                description={props.description}
                required={props.required}
            >
                <div id={props.id}>
                    <button
                        ref={inputRef}
                        class={clsx(
                            `flex gap-2 w-full items-center bg-secondary-900 text-primary-400 border border-secondary-800 rounded-md px-4 disabled:cursor-not-allowed`,
                            props.size === 'md' && 'py-[7px]',
                            props.size === 'xl' && 'py-[9px]',
                            props.size === '2xl' && 'py-[11px]',
                        )}
                        disabled={props.disabled}
                        onClick={() => {
                            calcDropdownPosition();
                            if (!opened.value) {
                                opened.value = true;
                            } else {
                                closeDropdown();
                            }
                            dropdownPosition.value.visible = false;
                            if (opened.value) {
                                highlightOptionIdx.value =
                                    filteredOptions.value.findIndex(
                                        (e) => e.value === props.selected,
                                    );
                                window.addEventListener('keydown', onKeyDown);
                            } else {
                                window.removeEventListener(
                                    'keydown',
                                    onKeyDown,
                                );
                            }
                        }}
                    >
                        {props.searchable && (
                            <div class={`stroke-gray-400`}>
                                <SearchIcon class={`size-3`} />
                            </div>
                        )}
                        <div
                            class={clsx(
                                'text-sm font-normal truncate',
                                // if placeholder
                                !searchTerm.value &&
                                    !selectedOption.value &&
                                    'text-primary',
                            )}
                        >
                            {displayText.value}
                        </div>
                        <div
                            class={`stroke-gray-400 ml-auto ${
                                opened.value ? `rotate-90` : `rotate-[-90deg]`
                            }`}
                        >
                            <ChevronLeftIcon class={`size-3`} />
                        </div>
                    </button>
                    {opened.value && (
                        <Teleport to={`body`}>
                            <ul
                                id={dropdownId}
                                class={`${props.fixed ? 'fixed' : 'absolute'} ${
                                    dropdownPosition.value.visible
                                        ? ''
                                        : 'opacity-0'
                                } z-100 max-h-[300px] overflow-auto bg-secondary-900 rounded shadow-xl max-w-[320px]`}
                                style={{
                                    top: `${dropdownPosition.value.top}px`,
                                    left: `${dropdownPosition.value.left}px`,
                                    minWidth: `${dropdownPosition.value.width}px`,
                                }}
                                v-click-outside={() => {
                                    closeDropdown();
                                }}
                            >
                                {filteredOptions.value.length > 0 ? (
                                    filteredOptions.value.map(
                                        (option, optionIdx) => {
                                            return (
                                                <li
                                                    id={`select_item_${optionIdx}`}
                                                >
                                                    <button
                                                        class={`${
                                                            highlightOptionIdx.value ===
                                                            optionIdx
                                                                ? 'bg-secondary-700 text-primary'
                                                                : option.value ===
                                                                    props.selected
                                                                  ? 'bg-primary-800 text-primary group is-selected'
                                                                  : 'text-primary'
                                                        } w-full px-4 py-2 text-left`}
                                                        onClick={() => {
                                                            selectOption();
                                                            opened.value = false;
                                                        }}
                                                        onMouseenter={() => {
                                                            if (option.disabled)
                                                                return;
                                                            highlightOptionIdx.value =
                                                                optionIdx;
                                                        }}
                                                        disabled={
                                                            option.disabled
                                                        }
                                                    >
                                                        {option.slot
                                                            ? option.slot(
                                                                  option,
                                                              )
                                                            : option.label}
                                                    </button>
                                                </li>
                                            );
                                        },
                                    )
                                ) : (
                                    <div class={`px-4 py-2`}>No options</div>
                                )}
                            </ul>
                        </Teleport>
                    )}
                </div>
            </InputWrapper>
        );
    },
});
