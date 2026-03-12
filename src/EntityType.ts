import {AbstractEdmClass} from './interfaces';
import {isEdmType} from './interfaces/EdmTypes';
import type {EdmNavigationProperty} from './interfaces/NavigationProperty';
import type {EdmProperty} from './interfaces/Property';
import type {EdmPropertyRef} from './interfaces/PropertyRef';
import type {EdmNamespace} from './Namespace';

type EntityTypeProperties<T extends Record<string, unknown>> = {
	name: string;
	namespace: EdmNamespace;
	basetype?: EdmEntityType;
	/**
	 * An entity is uniquely identified within an entity set by its key. An entity type that is not abstract MUST either contain exactly one edm:Key element or inherit its key from its base type. An abstract entity type MAY define a key if it doesn’t inherit one.
	 *
	 * An entity type’s key refers to the set of properties that uniquely identify an instance of the entity type within an entity set.
	 * http://docs.oasis-open.org/odata/odata/v4.0/os/part3-csdl/odata-v4.0-os-part3-csdl.html#_Toc372793937
	 */
	key?: EdmPropertyRef<T>[];
	/**
	 * An open type allows clients to add properties dynamically to instances of the type by specifying uniquely named values in the payload used to insert or update an instance of the type.
	 * If not specified, the OpenType attribute defaults to false.
	 * http://docs.oasis-open.org/odata/odata/v4.0/os/part3-csdl/odata-v4.0-os-part3-csdl.html#_Toc372793934
	 */
	abstract?: boolean;

	/**
	 * In OData v4, an open type is a structured type that contains dynamic properties, in addition to any properties that are declared in the type definition.
	 * Open types let you add flexibility to your data models.
	 * http://docs.oasis-open.org/odata/odata/v4.0/os/part3-csdl/odata-v4.0-os-part3-csdl.html#_Toc372793935
	 */
	opentype?: boolean;

	/**
	 * An entity type MAY specify a Boolean value for the HasStream attribute.
	 *
	 * A value of true specifies that the entity type is a media entity. Media entities are entities that represent a media stream, such as a photo. For more information on media entities see [OData-Protocol].
	 *
	 * http://docs.oasis-open.org/odata/odata/v4.0/os/part3-csdl/odata-v4.0-os-part3-csdl.html#_Toc372793936
	 */
	hasStream?: boolean;
};

/**
 * https://docs.oasis-open.org/odata/odata/v4.0/os/part3-csdl/odata-v4.0-os-part3-csdl.html#_Toc372793942
 */
export class EdmEntityType<T extends Record<string, unknown> = Record<string, unknown>> extends AbstractEdmClass {
	public readonly props: EntityTypeProperties<T>;
	public readonly schema: Record<keyof T, EdmProperty | EdmNavigationProperty>;
	public constructor(schema: Record<keyof T, EdmProperty | EdmNavigationProperty>, props: EntityTypeProperties<T>) {
		super(props.name, props.namespace);
		this.props = props;
		this.schema = schema;
		this.props.namespace.addType(this);
	}
	public toXMLSchema(doc: XMLDocument): Element {
		const entityType = doc.createElement('EntityType');
		entityType.setAttribute('Name', this.name);
		if (this.props.opentype) {
			entityType.setAttribute('OpenType', 'true');
		}
		if (this.props.abstract) {
			entityType.setAttribute('Abstract', 'true');
		}
		if (this.props.basetype) {
			entityType.setAttribute('BaseType', `${this.props.basetype.namespace.alias}.${this.props.basetype.name}`);
		}
		if (this.props.hasStream) {
			entityType.setAttribute('HasStream', 'true');
		}
		if (this.props.key) {
			const key = doc.createElement('Key');
			this.props.key.forEach((keyProperty) => {
				const propertyRef = doc.createElement('PropertyRef');
				propertyRef.setAttribute('Name', `${keyProperty.name.toString()}`);
				key.appendChild(propertyRef);
			});
			entityType.appendChild(key);
		}
		const data = Object.entries(this.schema).map(([name, property]) => {
			const element = doc.createElement(property.stype === 'Edm.Property' ? 'Property' : 'NavigationProperty');
			element.setAttribute('Name', name);
			if (property.nullable) {
				element.setAttribute('Nullable', 'true');
			}
			if (property.stype === 'Edm.NavigationProperty') {
				if (property.containsTarget) {
					element.setAttribute('ContainsTarget', 'true');
				}
				if (property.partner) {
					element.setAttribute('Partner', property.partner);
				}
				if (property.referentialConstraint) {
					for (const constraint of property.referentialConstraint) {
						const refConstraint = doc.createElement('ReferentialConstraint');
						refConstraint.setAttribute('Property', constraint.property);
						refConstraint.setAttribute('ReferencedProperty', constraint.referencedProperty);
						element.appendChild(refConstraint);
					}
				}
				if (property.onDelete) {
					const onDelete = doc.createElement('OnDelete');
					onDelete.setAttribute('Action', property.onDelete.action);
					element.appendChild(onDelete);
				}
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
		for (const children of data) {
			entityType.appendChild(children);
		}
		return entityType;
	}
}
