import {describe, expect, it} from 'vitest';
import format from 'xml-formatter';
import {DOMImplementation} from 'xmldom';
import {EdmEntityType} from '../src/EntityType';
import type {AbstractEdmClass} from '../src/interfaces';
import {EdmNamespace} from '../src/Namespace';

/* import {EdmEntityContainer} from '../src/EntityContainer';
import {EdmSingleton} from '../src/Singleton'; */

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

describe('ODataEntityType', () => {
	it('should build EntityType XML with link', () => {
		const namespace = new EdmNamespace('Demo', 'demo');
		const link = new EdmEntityType<ILink>(
			{
				uri: {type: 'Edm.String', stype: 'Edm.Property'},
			},
			{name: 'Link', namespace, key: [{name: 'name'}]},
		);
		const demo = new EdmEntityType<IDemo>(
			{
				name: {type: 'Edm.String', stype: 'Edm.Property'},
				value: {type: 'Edm.Int32', stype: 'Edm.Property'},
				link: {type: link, stype: 'Edm.Property'},
			},
			{name: 'Demo', namespace, key: [{name: 'name'}]},
		);
		const doc = new DOMImplementation().createDocument(null, null, null);
		doc.appendChild(demo.toXMLSchema(doc));
		expect(doc.toString()).to.equal(
			'<EntityType Name="Demo"><Key><PropertyRef Name="name"/></Key><Property Name="name" Type="Edm.String"/><Property Name="value" Type="Edm.Int32"/><Property Name="link" Type="demo.Link"/></EntityType>',
		);
	});
	it('should build EntityType XML with array link', () => {
		const namespace = new EdmNamespace('Demo', 'demo');

		const link = new EdmEntityType<ILink>(
			{
				uri: {type: 'Edm.String', stype: 'Edm.Property'},
			},
			{name: 'Link', namespace, key: [{name: 'name'}]},
		);
		const demo = new EdmEntityType<IDemo2>(
			{
				name: {type: 'Edm.String', stype: 'Edm.Property'},
				value: {type: 'Edm.Int32', stype: 'Edm.Property'},
				link: {type: [link], stype: 'Edm.Property'},
			},
			{name: 'Demo', namespace, key: [{name: 'name'}]},
		);
		// const container = new EdmEntityContainer([new EdmSingleton('link', namespace, ''), demo], {name: 'Demo', namespace});
		const doc = new DOMImplementation().createDocument(null, null, null);
		doc.appendChild(demo.toXMLSchema(doc));
		expect(doc.toString()).to.equal(
			'<EntityType Name="Demo"><Key><PropertyRef Name="name"/></Key><Property Name="name" Type="Edm.String"/><Property Name="value" Type="Edm.Int32"/><Property Name="link" Type="Collection(demo.Link)"/></EntityType>',
		);

		const fullDoc = new DOMImplementation().createDocument(null, null, null);
		fullDoc.appendChild(namespace.toXMLSchema(doc));
		expect(`\n${format(fullDoc.toString(), fopts)}`).to.equal(
			`
<edmx:Edmx Version="4.0" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">
  <edmx:DataServices>
    <Schema Namespace="Demo" Alias="demo" xmlns="http://docs.oasis-open.org/odata/ns/edm">
      <EntityType Name="Link">
        <Key>
          <PropertyRef Name="name"/>
        </Key>
        <Property Name="uri" Type="Edm.String"/>
      </EntityType>
      <EntityType Name="Demo">
        <Key>
          <PropertyRef Name="name"/>
        </Key>
        <Property Name="name" Type="Edm.String"/>
        <Property Name="value" Type="Edm.Int32"/>
        <Property Name="link" Type="Collection(demo.Link)"/>
      </EntityType>
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>`,
		);
	});
});
