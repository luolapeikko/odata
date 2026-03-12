import type {EdmParameter} from './interfaces/Parameter';
import type {EdmReturnType} from './interfaces/ReturnType';

export interface EdmAction {
	name: string;
	isBound: boolean;
	entitySetPath?: string;
	parameter?: EdmParameter;
	returnType?: EdmReturnType;
}
