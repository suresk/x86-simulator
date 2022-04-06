import {CPU} from "./CPU";
import {Instruction} from "./Instruction";
import {Operand, Program} from "./types";

export class Operation{
    readonly instruction: Instruction;
    readonly operands: Operand[];

    constructor(instruction: Instruction, operands: Operand[] = []) {
        this.instruction = instruction;
        this.operands = operands;
    }
}

export class Block{
    readonly name: string;
    readonly operations: Operation[] = new Array<Operation>(0);

    constructor(name: string) {
        this.name = name;
    }

    addOperation(operation: Operation): void {
        this.operations.push(operation);
    }
}

export class Noop{}

export class Assembler {

    readonly cpu: CPU;

    constructor(cpu: CPU) {
        this.cpu = cpu;
    }

    assemble(text: string): Program {
        let block: Block = new Block('undefined');
        let blocks: Map<string, Block> = new Map<string, Block>();

        let lineNo = 1;
        const lines = text.split('\n');
        for (const i in lines) {
            const line = lines[i];
            const result = this.parseLine(line, lineNo);

            if (result instanceof Operation) {
                if (block.name === 'undefined') {
                    throw new Error('No block in context, cannot attach operation.');
                }

                block.addOperation(result as Operation);
            } else if (result instanceof Block) {
                block = result as Block;
                blocks.set(block.name.toLowerCase(), block);
            }
            lineNo++;
        }

        return blocks;
    }

    parseLine(line: string, lineNo: Number): Block | Operation | Noop {
        const trimmed = line.trim();

        if (trimmed.length == 0) {
            // Blank line
            return new Noop();
        } else if (trimmed.at(0) === '#') {
            // Comment
            return new Noop();
        } else if (trimmed.endsWith(':')) {
            // Label, start a new block
            return new Block(trimmed.substring(0, trimmed.length - 1));
        } else {
            // Operation, build the operation
            return this.parseOperation(trimmed, lineNo);
        }
    }

    parseOperation(line: string, lineNo: Number): Operation {
        const instSplit = line.indexOf(' ');
        let inst: Instruction | undefined;
        let operands: Operand[] = new Array<Operand>();

        if (instSplit < 0) {
            // Zero-arg instruction, like HLT
            inst = this.findInstruction(line);
        } else {
            inst = this.findInstruction(line.substring(0, instSplit));
            const ops = line.substring(instSplit + 1).split(',');
            operands = ops.map(chunk => this.parseOperand(chunk.trim(), lineNo))
        }

        if (!inst) {
            throw new Error(`Undefined instruction at line ${lineNo}: ${line}`);
        }

        return new Operation(inst, operands);
    }

    parseOperand(chunk: string, lineNo: Number): Operand {
        if (!isNaN(parseInt(chunk))) {
            return parseInt(chunk);
        } else {
            let register = this.cpu.registers.get(chunk.toUpperCase());

            if (!register) {
                throw new Error(`Undefined register, line ${lineNo}, Register: ${chunk.toUpperCase()}`);
            } else {
                return register;
            }
        }
    }

    findInstruction(inst: string): Instruction | undefined {
        return this.cpu.validInstructions.get(inst.toUpperCase());
    }
}
