import {defaultCPU} from "./CPU";
import {Assembler} from "./Assembler";

const cpu = defaultCPU;

const asm = new Assembler(cpu);

const script = `.main:
    MOV RAX, 2
    MOV RDX, 5
    ADD RAX, RDX
    INT 1
    HLT
`;

let program = asm.assemble(script);

const result = cpu.execute(program);

console.log(`Result: ${result}`);

console.log("Register values:");

cpu.registers.forEach((v, k) => console.log(v));
