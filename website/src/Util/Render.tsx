import { Template } from "../../../src/templates/Template";

export default function renderTemplate({ template }: { template?: Template<string, string> | null }) {
	return <div dangerouslySetInnerHTML={{ __html: template?.toXML() }}></div>;
}
