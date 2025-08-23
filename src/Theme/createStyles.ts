import { StyleSheet } from 'react-native';
import { getTheme, subscribe, Theme } from './themeStore';

type AnyObj = Record<string, any>;
type StylesFactory<T extends AnyObj> = (theme: Theme) => T;

/** Token helper for the object form. */
export function color<K extends keyof Theme['colors']>(key: K) {
    return (t: Theme) => t.colors[key];
}

/** Deeply resolve functions with (theme) => value */
function deepResolve(obj: any, t: Theme): any {
    if (typeof obj === 'function') return obj(t);
    if (Array.isArray(obj)) return obj.map((x) => deepResolve(x, t));
    if (obj && typeof obj === 'object') {
        const out: AnyObj = {};
        for (const [k, v] of Object.entries(obj)) out[k] = deepResolve(v, t);
        return out;
    }
    return obj;
}

/**
 * Usage:
 * 1) Factory form (recommended):
 *    const styles = createStyles(t => ({ card: { backgroundColor: t.colors.primary } }));
 *
 * 2) Object+tokens form:
 *    const styles = createStyles({ card: { backgroundColor: color('primary') } });
 */
export function createStyles<T extends AnyObj>(
    factoryOrObject: StylesFactory<T> | T
): T {
    let cachedVersion = -1;
    let cachedSheet: T | null = null;

    const build = () => {
        const t = getTheme();
        if (!cachedSheet || cachedVersion !== t.version) {
            const raw = typeof factoryOrObject === 'function'
                ? (factoryOrObject as StylesFactory<T>)(t)
                : deepResolve(factoryOrObject as T, t);
            cachedSheet = StyleSheet.create(raw) as T;
            cachedVersion = t.version;
        }
        return cachedSheet!;
    };

    // Lazy proxy so `styles.key` works like a normal StyleSheet object.
    const proxy = new Proxy({} as T, {
        get(_target, prop: string) {
            const sheet = build() as any;
            return sheet[prop];
        },
        ownKeys() { return Reflect.ownKeys(build() as any); },
        getOwnPropertyDescriptor() { return { enumerable: true, configurable: true }; },
    });

    // Invalidate cache when theme changes.
    const unsub = subscribe(() => { cachedVersion = -1; cachedSheet = null; });
    // It's module-level in practice, so no need to unsubscribe.

    return proxy;
}
