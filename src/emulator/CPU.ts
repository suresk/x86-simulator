import {Register} from "./Register";
import {availableInstructions, Instruction} from "./Instruction";
import {Operand, Program} from "./types";
import {Block, Operation} from "./Assembler";

export const defaultRegisters: Map<string, Register> = new Map([
    ['RAX', new Register('RAX')],
    ['RDX', new Register('RDX')],
]);

export class CPU {
    readonly registers: Map<string, Register>;
    readonly validInstructions: Map<string, Instruction>;
    pc: number = 0;

    constructor(registers: Map<string, Register>, validInstructions: Map<string, Instruction>) {
        this.registers = registers;
        this.validInstructions = validInstructions;
    }

    execute(program: Program): number {
        const main = program.get(".main");

        if (!main) {
            console.log("Cannot find .main block.");
            return -1;
        }

        try {
            this.executeBlock(main);
        } catch(e) {
            console.log(e);
            return -1;
        }

        return 0;
    }

    executeBlock(block: Block): void {
        for (const i in block.operations) {
            if (!this.executeOperation(block.operations[i])) {
                return;
            }
        }
    }

    executeOperation(operation: Operation): boolean {
        switch (operation.instruction.name) {
            case "MOV":
                this.assertLength(operation, 2);
                const dest = this.getRegister((operation.operands[0] as Register).name);
                const src = operation.operands[1];

                if (src instanceof Register) {
                    const srcReg = this.registers.get((src as Register).name);

                    if (!srcReg) {
                        throw new Error(`Unknown register: ${srcReg}.`);
                    }

                    dest.setValue(srcReg.getValue());

                } else {
                    dest.setValue(src as number);
                }
                break;
            case "INT":
                const interrupt = operation.operands[0] as number;
                if (interrupt == 1) {
                    const rax = this.getRegister('RAX');

                    console.log(`| ${rax.getValue()}`);
                } else {
                    throw new Error(`Undefined interrupt: ${interrupt}`);
                }
                break;
            case "ADD":
                const addDest = this.getRegister((operation.operands[0] as Register).name);
                const addSrc = this.getRegister((operation.operands[1] as Register).name);
                addDest.addValue(addSrc.getValue());
                break;
            case "HLT":
                return false;
                break;
            default:
                throw new Error(`Unknown instruction: ${operation.instruction.name}`);
        }
        this.pc += 1;
        return true;
    }

    assertLength(operation: Operation, length: number): void {
        const operands = operation.operands;
        if (operands.length < length) {
            throw new Error(`Expected ${length} operands, got ${operands.length} for operation ${operation}.`);
        }
    }

    getRegister(name: string): Register {
        const reg = this.registers.get(name);

        if (!reg) {
            throw new Error(`${reg} undefined.`);
        }

        return reg;
    }
}

export const defaultCPU: CPU = new CPU(defaultRegisters, availableInstructions);
