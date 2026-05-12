import type {Document, Node} from '@xmldom/xmldom';
import type {EdmComplexType} from './ComplexType';
import type {EdmEntityType} from './EntityType';
import {AbstractEdmClass} from './interfaces';
import type {EdmNamespace} from './Namespace';

type EntrySetElement<T extends Record<string, unknown> = Record<string, unknown>> = EdmComplexType<T> | EdmEntityType<T>;
export class EdmEntrySet<T extends Record<string, unknown> = Record<string, unknown>> extends AbstractEdmClass {
	public element: EntrySetElement<T>;
	public stype = 'Edm.EntrySet';
	public namespace: EdmNamespace;
	public constructor(name: string, element: EntrySetElement<T>, namespace: EdmNamespace) {
		super(name, namespace);
		this.element = element;
		this.namespace = namespace;
		this.namespace.addType(this);
	}
	public toXMLSchema(doc: Document): Node {
		const entrySet = doc.createElement('EntitySet');
		entrySet.setAttribute('Name', this.name);
		entrySet.setAttribute('EntityType', `${this.element.namespace.namespace}.${this.element.name}`);
		return entrySet;
	}
}
