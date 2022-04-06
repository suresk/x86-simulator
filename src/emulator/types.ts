import {Instruction} from "./Instruction";
import {Register} from "./Register";
import {Block} from "./Assembler";

export type Operand = number | Register;
export type Program = Map<string, Block>;
