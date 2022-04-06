export class Instruction {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export const availableInstructions: Map<string, Instruction> = new Map([
    ['MOV', new Instruction('MOV')],
    ['INT', new Instruction('INT')],
    ['HLT', new Instruction('HLT')],
    ['ADD', new Instruction('ADD')],
]);
