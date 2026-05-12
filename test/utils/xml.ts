import type {Document} from '@xmldom/xmldom';
import {DOMImplementation} from '@xmldom/xmldom';

export function createEmptyXmlDocument(): Document {
	return new DOMImplementation().createDocument(null, '', null);
}
