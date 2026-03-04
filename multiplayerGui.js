import mainGui from "./mainGui";

const GuiButton = Java.type("net.minecraft.client.gui.GuiButton");
const GuiMultiplayer = Java.type("net.minecraft.client.gui.GuiMultiplayer");

const openButton = newButton("§a▼", 20);

register("postGuiRender", (mouseX, mouseY, gui) => {
	if (!(gui instanceof GuiMultiplayer)) return;
	openButton.field_146128_h = Renderer.screen.getWidth() - 20;
	openButton.field_146129_i = Renderer.screen.getHeight() - 20;
	openButton.func_146112_a(Client.getMinecraft(), mouseX, mouseY);
});

register("guiMouseClick", (mouseX, mouseY, button, gui, event) => {
	if (button !== 0) return;
	if (!(gui instanceof GuiMultiplayer)) return;
	if (!openButton.func_146116_c(Client.getMinecraft(), mouseX, mouseY)) return;
	openButton.func_146113_a(Client.getMinecraft().func_147118_V());
	mainGui.open(gui);
	cancel(event);
});

function newButton(text = "", width = 96, height = 20) {
	return new GuiButton(randomComponentId(), 0, 0, width, height, text);
}

function randomComponentId() {
	return Math.floor(Math.random() * 4294967296 - 2147483648);
}
