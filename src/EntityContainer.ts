import type {EdmEntrySet} from './EntrySet';
import {AbstractEdmClass} from './interfaces';
import type {EdmNamespace} from './Namespace';
import type {EdmSingleton} from './Singleton';

type EdmEntityContainerProperties = {
	name: string;
	namespace: EdmNamespace;
};

type ContainerItem<T extends Record<string, unknown> = Record<string, unknown>> = EdmEntrySet | EdmSingleton<T>;

export class EdmEntityContainer<T extends Record<string, unknown> = Record<string, unknown>> extends AbstractEdmClass {
	public readonly props: EdmEntityContainerProperties;
	public readonly items: ContainerItem<T>[];
	public constructor(items: ContainerItem<T>[], props: EdmEntityContainerProperties) {
		super(props.name, props.namespace);
		this.props = props;
		this.items = items;
		this.props.namespace.addType(this);
	}
	public toXMLSchema(doc: XMLDocument): Element {
		const container = doc.createElement('EntityContainer');
		container.setAttribute('Name', this.props.name);
		for (const item of this.items) {
			container.appendChild(item.toXMLSchema(doc));
		}
		return container;
	}
}
