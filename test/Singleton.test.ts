import {describe, expect, it} from 'vitest';
import {DOMImplementation} from 'xmldom';
import {EdmComplexType} from '../src/ComplexType';
import {EdmEntityContainer} from '../src/EntityContainer';
import {EdmEntityType} from '../src/EntityType';
import {EdmNamespace} from '../src/Namespace';
import {EdmSingleton} from '../src/Singleton';

interface IDemo extends Record<string, unknown> {
	name: string;
	value: number;
}

describe('EdmSingleton', () => {
	it('should add EntityType to Singleton', () => {
		const namespace = new EdmNamespace('unittest.ns', 'ns');
		const doc = new DOMImplementation().createDocument(null, null, null);
		const entity = new EdmEntityType<IDemo>(
			{
				name: {type: 'Edm.String', stype: 'Edm.Property'},
				value: {type: 'Edm.Int32', stype: 'Edm.Property'},
			},
			{name: 'Entity', namespace, key: [{name: 'name'}]},
		);

		const entitySingleton = new EdmSingleton('baseEntity', entity, namespace);
		doc.appendChild(entitySingleton.toXMLSchema(doc));
		expect(doc.toString()).to.equal('<Singleton Name="baseEntity" Type="unittest.ns.Entity"/>');
	});
	it('should add ComplexType to Singleton', () => {
		const namespace = new EdmNamespace('unittest.ns', 'ns');
		const doc = new DOMImplementation().createDocument(null, null, null);
		const complex = new EdmComplexType<IDemo>(
			{
				name: {type: 'Edm.String', stype: 'Edm.Property'},
				value: {type: 'Edm.Int32', stype: 'Edm.Property'},
			},
			{name: 'Complex', namespace},
		);
		const complexSingleton = new EdmSingleton('baseComplex', complex, namespace);
		const edmEntityContainer = new EdmEntityContainer([complexSingleton], {name: 'Container', namespace});
		doc.appendChild(edmEntityContainer.toXMLSchema(doc));
		expect(doc.toString()).to.equal('<EntityContainer Name="Container"><Singleton Name="baseComplex" Type="unittest.ns.Complex"/></EntityContainer>');
	});
});
