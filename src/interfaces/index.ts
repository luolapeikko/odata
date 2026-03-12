import type {EdmNamespace} from '../Namespace';
import type {EdmType} from './EdmTypes';
import type {ToXmlSchema} from './xmlFunction';

export abstract class AbstractEdmClass implements ToXmlSchema {
	public readonly name: string;
	public readonly namespace: EdmNamespace;
	public constructor(name: string, namespace: EdmNamespace) {
		this.name = name;
		this.namespace = namespace;
	}
	public abstract toXMLSchema(doc: XMLDocument): Element;
}

export interface EdmPropertyBase {
	stype: 'Edm.Property' | 'Edm.NavigationProperty';
	type: EdmType | AbstractEdmClass | [AbstractEdmClass];
	nullable?: boolean;
}
