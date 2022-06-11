import { convertToDaisyHSLAndColor } from './../hooks/theme-changer/daisy-utils/daisy-color-fns';
import { Theme, setCompiledTheme, compileTheme, VuetifyBrandColors } from "@/hooks/theme-changer/helpers";
import { presets } from "@/hooks/theme-changer/presets";
import { DaisyColorShorthand, DaisyColorName } from '@/hooks/theme-changer/daisy-utils/daisy-types';

export const useThemeStore = defineStore("site-theme", {
    // convert to a function
    state: (): Theme & { outputCache: [VuetifyBrandColors, Record<DaisyColorShorthand, string>] } => {
        const [convert, colormap] = convertToDaisyHSLAndColor(presets[0].colors);

        const out: [VuetifyBrandColors, Record<DaisyColorShorthand, string>] = [{
            background: colormap['--b1'].rgb().hex(),
            surface: (colormap['--b2'] || colormap['--b1'].darken(0.1)).rgb().hex(),
            primary: colormap['--p'].rgb().hex(),
            secondary: colormap['--s'].rgb().hex(),
            accent: colormap['--a'].rgb().hex(),
            error: colormap['--er'].rgb().hex(),
            success: colormap['--su'].rgb().hex(),
            info: colormap['--in'].rgb().hex(),
            warning: colormap['--wa'].rgb().hex(),
        }, convert]

        const outputCache = out;

        return { outputCache, ...presets[0] }
    },
    getters: {
    },
    actions: {
        setTheme(name: string) {
            const a = presets.find(x => x.name === name)
            if (!a) return;
            const init = presets[0].colors;
            this.colors = { ...init, ...a.colors };
            this.dark = a.dark;
            this.name = a.name;

            this.saveAndCacheVuetify();
            // Dark.set(this.dark);
        },
        setCustomTheme(prop: DaisyColorName, color: `#${string}`) {
            this.name = 'USER'
            this.colors[prop] = color;

            this.saveAndCacheVuetify();
        },
        setCustomThemeDark(bool: boolean) {
            this.dark = bool;
        },
        init() {
            this.saveAndCacheVuetify();
        },
        saveAndCacheVuetify() {
            const [convert, colormap] = convertToDaisyHSLAndColor(this.colors);

            const out: [VuetifyBrandColors, Record<DaisyColorShorthand, string>] = [{
                background: colormap['--b1'].rgb().hex(),
                surface: (colormap['--b2'] || colormap['--b1'].darken(0.1)).rgb().hex(),
                primary: colormap['--p'].rgb().hex(),
                secondary: colormap['--s'].rgb().hex(),
                accent: colormap['--a'].rgb().hex(),
                error: colormap['--er'].rgb().hex(),
                success: colormap['--su'].rgb().hex(),
                info: colormap['--in'].rgb().hex(),
                warning: colormap['--wa'].rgb().hex(),
            }, convert]

            this.outputCache = out;
        }
    },
    share: {
        enable: true,
        initialize: true, // when initializing, fetch from another tab.
    },
    persistedState: {
        persist: true,
    }
});

