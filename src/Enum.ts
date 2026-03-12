import {AbstractEdmClass} from './interfaces';
import type {EdmNamespace} from './Namespace';

export class EdmEnum extends AbstractEdmClass {
	public readonly name: string;
	public readonly enumValues: Record<number, string>;
	public constructor(name: string, namespace: EdmNamespace, enumValues: Record<number, string>) {
		super(name, namespace);
		this.name = name;
		this.enumValues = enumValues;
		namespace.addType(this);
	}
	public toXMLSchema(doc: XMLDocument): Element {
		const enumType = doc.createElement('EnumType');
		enumType.setAttribute('Name', this.name);
		// store enum names and values to Members
		const members = Object.entries(this.enumValues).map(([value, name]) => {
			const member = doc.createElement('Member');
			member.setAttribute('Name', name);
			member.setAttribute('Value', value);
			return member;
		});
		for (const children of members) {
			enumType.appendChild(children);
		}
		return enumType;
	}
}
