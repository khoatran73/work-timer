type NameOf<T> = (selector: (obj: T) => any) => string;

export function nameof<T>(selector: (obj: T) => any): string {
    const keys = selector.toString()
        .match(/(?:^|\.)(\w+)/g)
        ?.map(key => key.replace(/^\./, '')) || [];
    return keys[keys.length - 1]; 
}

export namespace nameof {
    export function full<T>(selector: (obj: T) => any): string {
        const keys = selector.toString()
            .match(/(?:^|\.)(\w+)/g)
            ?.map(key => key.replace(/^\./, '')) || [];
        return keys.join('.');
    }
}