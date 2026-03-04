const Toolkit = Java.type("java.awt.Toolkit");
const DataFlavor = Java.type("java.awt.datatransfer.DataFlavor");
const StringSelection = Java.type("java.awt.datatransfer.StringSelection");

export function copy(text) {
	Toolkit.getDefaultToolkit().getSystemClipboard().setContents(new StringSelection(text), null);
}

export function paste() {
	return Toolkit.getDefaultToolkit().getSystemClipboard().getData(DataFlavor.stringFlavor);
}

export default { copy, paste };
