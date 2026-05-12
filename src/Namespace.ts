import type {Document, Node} from '@xmldom/xmldom';
import type {ToXmlSchema} from './interfaces/xmlFunction';

export class EdmNamespace implements ToXmlSchema {
	public readonly namespace: string;
	public readonly alias: string;
	public readonly elements: ToXmlSchema[] = [];

	public constructor(namespace: string, alias: string) {
		this.namespace = namespace;
		this.alias = alias;
	}
	public addType(type: ToXmlSchema): void {
		this.elements.push(type);
	}
	public toXMLSchema(doc: Document): Node {
		const edmXml = doc.createElementNS('http://docs.oasis-open.org/odata/ns/edmx', 'edmx:Edmx');
		edmXml.setAttribute('Version', '4.0');
		const edmDataServices = doc.createElement('edmx:DataServices');
		edmXml.appendChild(edmDataServices);

		const schema = doc.createElementNS('http://docs.oasis-open.org/odata/ns/edm', 'Schema');
		schema.setAttribute('Namespace', this.namespace);
		schema.setAttribute('Alias', this.alias);
		for (const e of this.elements) {
			schema.appendChild(e.toXMLSchema(doc));
		}
		edmDataServices.appendChild(schema);
		return edmXml;
	}
}
