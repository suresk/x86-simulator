export class Register {
    readonly name: string = '';
    value: number = 0;

    constructor(name:string) {
        this.name = name;
    }

    setValue(value: number): void {
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }

    addValue(value: number): void {
        this.value += value;
    }

    toString(): string {
        return `${this.name}: ${this.value}`;
    }

}
