import {describe, expect, it} from 'vitest';
import format from 'xml-formatter';
import {DOMImplementation} from 'xmldom';
import {EdmComplexType} from '../src/ComplexType';
import type {AbstractEdmClass} from '../src/interfaces';
import {EdmNamespace} from '../src/Namespace';

const fopts = {indentation: '  ', lineSeparator: '\n'};

interface ILink extends Record<string, unknown> {
	uri: string;
}

interface IDemo extends Record<string, unknown> {
	name: string;
	value: number;
	link: AbstractEdmClass;
}

interface IDemo2 extends Record<string, unknown> {
	name: string;
	value: number;
	link: [AbstractEdmClass];
}

describe('ODataComplexType', () => {
	it('should build ComplexType XML with link', () => {
		const namespace = new EdmNamespace('Demo', 'demo');
		const link = new EdmComplexType<ILink>(
			{
				uri: {type: 'Edm.String', stype: 'Edm.Property'},
			},
			{name: 'Link', namespace},
		);
		const demo = new EdmComplexType<IDemo>(
			{
				name: {type: 'Edm.String', stype: 'Edm.Property'},
				value: {type: 'Edm.Int32', stype: 'Edm.Property'},
				link: {type: link, stype: 'Edm.Property'},
			},
			{name: 'Demo', namespace},
		);
		const doc = new DOMImplementation().createDocument(null, null, null);
		doc.appendChild(demo.toXMLSchema(doc));
		expect(doc.toString()).to.equal(
			'<ComplexType Name="Demo"><Property Name="name" Type="Edm.String"/><Property Name="value" Type="Edm.Int32"/><Property Name="link" Type="demo.Link"/></ComplexType>',
		);
	});
	it('should build ComplexType XML with array link', () => {
		const namespace = new EdmNamespace('Demo', 'demo');
		const link = new EdmComplexType<ILink>(
			{
				uri: {type: 'Edm.String', stype: 'Edm.Property'},
			},
			{name: 'Link', namespace},
		);
		const demo = new EdmComplexType<IDemo2>(
			{
				name: {type: 'Edm.String', stype: 'Edm.Property'},
				value: {type: 'Edm.Int32', stype: 'Edm.Property'},
				link: {type: [link], stype: 'Edm.Property'},
			},
			{name: 'Demo', namespace},
		);
		const doc = new DOMImplementation().createDocument(null, null, null);
		doc.appendChild(demo.toXMLSchema(doc));
		expect(`\n${format(doc.toString(), fopts)}`).to.equal(
			`
<ComplexType Name="Demo">
  <Property Name="name" Type="Edm.String"/>
  <Property Name="value" Type="Edm.Int32"/>
  <Property Name="link" Type="Collection(demo.Link)"/>
</ComplexType>`,
		);

		const fullDoc = new DOMImplementation().createDocument(null, null, null);
		fullDoc.appendChild(namespace.toXMLSchema(doc));
		expect(`\n${format(fullDoc.toString(), fopts)}`).to.equal(
			`
<edmx:Edmx Version="4.0" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">
  <edmx:DataServices>
    <Schema Namespace="Demo" Alias="demo" xmlns="http://docs.oasis-open.org/odata/ns/edm">
      <ComplexType Name="Link">
        <Property Name="uri" Type="Edm.String"/>
      </ComplexType>
      <ComplexType Name="Demo">
        <Property Name="name" Type="Edm.String"/>
        <Property Name="value" Type="Edm.Int32"/>
        <Property Name="link" Type="Collection(demo.Link)"/>
      </ComplexType>
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>`,
		);
	});
});
