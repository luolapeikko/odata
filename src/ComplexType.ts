import type {Document, Node} from '@xmldom/xmldom';
import {AbstractEdmClass} from './interfaces';
import {isEdmType} from './interfaces/EdmTypes';
import type {EdmProperty} from './interfaces/Property';
import type {EdmNamespace} from './Namespace';

type ComplexTypeProperties = {
	name: string;
	namespace: EdmNamespace;
	basetype?: EdmComplexType;
	/**
	 * In OData v4, an open type is a structured type that contains dynamic properties, in addition to any properties that are declared in the type definition.
	 * Open types let you add flexibility to your data models.
	 * @see https://learn.microsoft.com/en-us/aspnet/web-api/overview/odata-support-in-aspnet-web-api/odata-v4/use-open-types-in-odata-v4
	 */
	opentype?: boolean;
	/**
	 * An open type allows clients to add properties dynamically to instances of the type by specifying uniquely named values in the payload used to insert or update an instance of the type.
	 * If not specified, the OpenType attribute defaults to false.
	 * https://docs.oasis-open.org/odata/odata/v4.0/os/part3-csdl/odata-v4.0-os-part3-csdl.html#_Toc372793945
	 */
	abstract?: boolean;
};

/**
 * https://docs.oasis-open.org/odata/odata/v4.0/os/part3-csdl/odata-v4.0-os-part3-csdl.html#_Toc372793942
 */
export class EdmComplexType<T extends Record<string, unknown> = Record<string, unknown>> extends AbstractEdmClass {
	public readonly props: ComplexTypeProperties;
	public readonly schema: Record<keyof T, EdmProperty>;
	public constructor(schema: Record<keyof T, EdmProperty>, props: ComplexTypeProperties) {
		super(props.name, props.namespace);
		this.props = props;
		this.schema = schema;
		this.props.namespace.addType(this);
	}
	public toXMLSchema(doc: Document): Node {
		const complexType = doc.createElement('ComplexType');
		complexType.setAttribute('Name', this.name);
		if (this.props.opentype) {
			complexType.setAttribute('OpenType', 'true');
		}
		if (this.props.abstract) {
			complexType.setAttribute('Abstract', 'true');
		}
		if (this.props.basetype) {
			complexType.setAttribute('BaseType', `${this.props.basetype.namespace.alias}.${this.props.basetype.name}`);
		}
		const elements = Object.entries(this.schema).map(([name, property]) => {
			const element = doc.createElement('Property');
			element.setAttribute('Name', name);
			if (property.nullable) {
				element.setAttribute('Nullable', 'true');
			}
			if (isEdmType(property.type)) {
				element.setAttribute('Type', property.type);
			} else {
				if (Array.isArray(property.type)) {
					element.setAttribute('Type', `Collection(${property.type[0].namespace.alias}.${property.type[0].name})`);
				} else {
					element.setAttribute('Type', `${property.type.namespace.alias}.${property.type.name}`);
				}
			}
			return element;
		});
		for (const children of elements) {
			complexType.appendChild(children);
		}
		return complexType;
	}
}
