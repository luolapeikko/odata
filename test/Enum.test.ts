import {describe, expect, it} from 'vitest';
import {DOMImplementation} from 'xmldom';
import {EdmEnum} from '../src/Enum';
import {EdmNamespace} from '../src/Namespace';

enum Demo {
	one = 1,
	two = 2,
	three = 3,
}

describe('ODataEnum', () => {
	it('should build Enum XML', () => {
		const namespace = new EdmNamespace('Demo', 'demo');
		const doc = new DOMImplementation().createDocument(null, null, null);
		const enumClass = new EdmEnum('Demo', namespace, Demo);
		doc.appendChild(enumClass.toXMLSchema(doc));
		expect(doc.toString()).to.equal(
			'<EnumType Name="Demo"><Member Name="one" Value="1"/><Member Name="two" Value="2"/><Member Name="three" Value="3"/><Member Name="1" Value="one"/><Member Name="2" Value="two"/><Member Name="3" Value="three"/></EnumType>',
		);
	});
});
