import { defineComponent } from 'vue';
import { DefaultComponentProps } from '@root/components/_default.ts';
import clsx from 'clsx';

export const GameTitle = defineComponent({
    props: {
        ...DefaultComponentProps,
    },
    setup(props) {
        return () => (
            <div
                class={clsx(
                    `relative font-secondary flex items-center gap-4`,
                    props.class
                        ? props.class
                        : `text-[64px] mt-20 mx-auto justify-center`,
                )}
            >
                <div
                    class={clsx(`text-primary`)}
                    style={{
                        textShadow: `0px 2px 10px rgba(0,0,0,0.4)`,
                    }}
                >
                    Faded:
                </div>
                <div
                    class={clsx(`text-secondary`)}
                    style={{
                        textShadow: `0px 2px 10px rgba(0,0,0,0.4)`,
                    }}
                >
                    Pollution
                </div>
            </div>
        );
    },
});
