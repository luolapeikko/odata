import type {Document, Node} from '@xmldom/xmldom';

export interface ToXmlSchema {
	toXMLSchema(doc: Document): Node;
}
